import { useEffect, useState } from "react";
import { getOverall } from "../api";
import type { OverallEntry } from "../api";

const medalColors: Record<number, string> = {
  1: "#F5C518",
  2: "#B0B0B0",
  3: "#CD7F32",
};

export default function OverallLeaderboard() {
  const [data, setData] = useState<OverallEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverall()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        margin: "0 16px 16px",
        background: "#fff",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "0.5px solid var(--gray-200)",
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--blue-600)",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          Overall Leaderboard
        </p>
      </div>
      {loading ? (
        <p style={{ padding: 20, color: "var(--gray-400)", fontSize: 14 }}>
          Loading...
        </p>
      ) : (
        <div>
          {data.length === 0 && (
            <p style={{ padding: 20, color: "var(--gray-400)", fontSize: 14 }}>
              No matches played yet.
            </p>
          )}
          {data.map((entry, i) => (
            <div
              key={entry.playerId}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom:
                  i < data.length - 1 ? "0.5px solid var(--gray-100)" : "none",
                background: entry.ineligible ? "#FFF8F8" : "transparent",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: medalColors[entry.rank]
                    ? medalColors[entry.rank] + "22"
                    : "var(--gray-100)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: medalColors[entry.rank] ?? "var(--gray-600)",
                  marginRight: 14,
                  flexShrink: 0,
                }}
              >
                {entry.rank}
              </div>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: entry.rank <= 3 ? 500 : 400,
                    color: entry.ineligible ? "#C0392B" : "var(--gray-800)",
                    textDecoration: entry.ineligible ? "line-through" : "none",
                  }}
                >
                  {entry.playerName}
                </p>
                {entry.ineligible && (
                  <span style={{ fontSize: 11, color: "#E74C3C" }}>
                    ineligible
                  </span>
                )}
                {entry.isNormalised && !entry.ineligible && (
                  <span style={{ fontSize: 11, color: "var(--blue-400)" }}>
                    normalised · {entry.matchesAttended} played
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: entry.ineligible
                    ? "var(--gray-300)"
                    : "var(--blue-600)",
                }}
              >
                {entry.totalPoints}
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--gray-400)",
                    marginLeft: 2,
                  }}
                >
                  pts
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
