import { useEffect, useState } from "react";
import { getPodiumRate } from "../../api";
import type { PodiumRateData } from "../../api";

export default function PodiumRateChart() {
  const [data, setData] = useState<PodiumRateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPodiumRate()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
        marginBottom: 16,
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
          Podium Rate
        </p>
        <p style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 2 }}>
          % of attended matches finishing top 3
        </p>
      </div>
      {loading ? (
        <p style={{ padding: 20, color: "var(--gray-400)", fontSize: 14 }}>
          Loading...
        </p>
      ) : (
        <div style={{ padding: "12px 20px 20px" }}>
          {data.map((entry, i) => (
            <div
              key={entry.playerId}
              style={{ marginBottom: i < data.length - 1 ? 14 : 0 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 13, color: "var(--gray-800)" }}>
                  {entry.playerName}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--blue-600)",
                  }}
                >
                  {entry.podiumRate}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "var(--gray-100)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${entry.podiumRate}%`,
                    background:
                      entry.podiumRate >= 60
                        ? "linear-gradient(90deg, #185FA5, #378ADD)"
                        : entry.podiumRate >= 35
                          ? "linear-gradient(90deg, #378ADD, #85B7EB)"
                          : "var(--gray-200)",
                    borderRadius: 3,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
              <p
                style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 3 }}
              >
                {entry.podiumFinishes} podiums in {entry.attended} matches
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
