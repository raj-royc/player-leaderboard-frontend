import { useEffect, useState } from "react";
import { getMatches, getMatchTopThree } from "../api";
import type { MatchTopThree } from "../api";

export default function MatchResultCard() {
  const [completedMatches, setCompletedMatches] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<MatchTopThree | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches().then((matches) => {
      const completed = matches
        .filter((m) => m.isCompleted)
        .map((m) => m.matchNumber)
        .sort((a, b) => b - a);
      setCompletedMatches(completed);
      setCurrentIndex(0);
    });
  }, []);

  useEffect(() => {
    if (completedMatches.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getMatchTopThree(completedMatches[currentIndex])
      .then(setResult)
      .finally(() => setLoading(false));
  }, [completedMatches, currentIndex]);

  const positions = [
    { label: "🥇 First", key: "firstPlace", color: "#B8860B", bg: "#FFFBEA" },
    {
      label: "🥈 Second",
      key: "secondPlace",
      color: "var(--gray-600)",
      bg: "var(--gray-50)",
    },
    { label: "🥉 Third", key: "thirdPlace", color: "#A0522D", bg: "#FDF6F0" },
  ] as const;

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
        <div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--blue-600)",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            Match Result
          </p>
          {result && (
            <p style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 2 }}>
              {new Date(result.matchDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={currentIndex >= completedMatches.length - 1}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "0.5px solid var(--gray-200)",
              background: "none",
              cursor:
                currentIndex >= completedMatches.length - 1
                  ? "not-allowed"
                  : "pointer",
              color:
                currentIndex >= completedMatches.length - 1
                  ? "var(--gray-200)"
                  : "var(--blue-600)",
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
              minWidth: 60,
              textAlign: "center",
            }}
          >
            {completedMatches.length > 0
              ? `Match ${completedMatches[currentIndex]}`
              : "—"}
          </span>
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex <= 0}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "0.5px solid var(--gray-200)",
              background: "none",
              cursor: currentIndex <= 0 ? "not-allowed" : "pointer",
              color: currentIndex <= 0 ? "var(--gray-200)" : "var(--blue-600)",
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
      ) : completedMatches.length === 0 ? (
        <p style={{ padding: 20, color: "var(--gray-400)", fontSize: 14 }}>
          No matches played yet.
        </p>
      ) : result ? (
        <div
          style={{
            padding: "12px 16px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {positions.map(({ label, key, color, bg }) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 12,
                background: bg,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--gray-500)" }}>
                {label}
              </span>
              <span style={{ fontSize: 15, fontWeight: 500, color }}>
                {result[key]}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
