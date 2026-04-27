import { useEffect, useState } from "react";
import { getWeekly, getMatches } from "../api";
import type { WeeklyEntry } from "../api";

export default function WeeklyLeaderboard() {
  const [week, setWeek] = useState(1);
  const [maxWeek, setMaxWeek] = useState(1);
  const [data, setData] = useState<WeeklyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches().then((matches) => {
      const completed = matches.filter((m) => m.isCompleted && m.weekNumber);
      const max =
        completed.length > 0
          ? Math.max(...completed.map((m) => m.weekNumber!))
          : 1;
      setMaxWeek(max);
      setWeek(max);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getWeekly(week)
      .then(setData)
      .finally(() => setLoading(false));
  }, [week]);

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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          Weekly
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setWeek((w) => Math.max(1, w - 1))}
            disabled={week === 1}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "0.5px solid var(--gray-200)",
              background: "none",
              cursor: week === 1 ? "not-allowed" : "pointer",
              color: week === 1 ? "var(--gray-200)" : "var(--blue-600)",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--gray-600)",
              minWidth: 48,
              textAlign: "center",
            }}
          >
            Week {week}
          </span>
          <button
            onClick={() => setWeek((w) => Math.min(maxWeek, w + 1))}
            disabled={week === maxWeek}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "0.5px solid var(--gray-200)",
              background: "none",
              cursor: week === maxWeek ? "not-allowed" : "pointer",
              color: week === maxWeek ? "var(--gray-200)" : "var(--blue-600)",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </div>
      </div>
      {loading ? (
        <p style={{ padding: 20, color: "var(--gray-400)", fontSize: 14 }}>
          Loading...
        </p>
      ) : (
        <div>
          {data.length === 0 && (
            <p style={{ padding: 20, color: "var(--gray-400)", fontSize: 14 }}>
              No matches this week.
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
              }}
            >
              <p
                style={{
                  width: 24,
                  fontSize: 13,
                  color: "var(--gray-400)",
                  marginRight: 14,
                }}
              >
                {entry.rank}
              </p>
              <p style={{ flex: 1, fontSize: 15 }}>{entry.playerName}</p>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--blue-600)",
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
