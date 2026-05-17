import { useEffect, useState } from "react";
import { getPlayers, getPlayerForm } from "../../api";
import type { Player, FormData } from "../../api";

const resultConfig: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  "1st": { color: "#B8860B", bg: "#FFFBEA", label: "🥇" },
  "2nd": { color: "#6B7280", bg: "#F3F4F6", label: "🥈" },
  "3rd": { color: "#A0522D", bg: "#FDF6F0", label: "🥉" },
  absent: { color: "#E74C3C", bg: "#FFF8F8", label: "✗" },
};

export default function FormChart() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPlayers().then((p) => {
      setPlayers(p);
      if (p.length > 0) setSelectedId(p[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    getPlayerForm(selectedId)
      .then(setForm)
      .finally(() => setLoading(false));
  }, [selectedId]);

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
          Form — Last 5 Matches
        </p>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border: "0.5px solid var(--gray-200)",
            fontSize: 14,
            color: "var(--gray-800)",
            background: "#fff",
            marginBottom: 16,
          }}
        >
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {loading ? (
          <p style={{ color: "var(--gray-400)", fontSize: 14 }}>Loading...</p>
        ) : (
          form && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[...form.recentMatches].reverse().map((match) => {
                const config = resultConfig[match.result];
                return (
                  <div
                    key={match.matchNumber}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "12px 8px",
                      borderRadius: 12,
                      background: config.bg,
                      border: `0.5px solid ${config.color}22`,
                    }}
                  >
                    <span style={{ fontSize: 20, marginBottom: 6 }}>
                      {config.label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: config.color,
                      }}
                    >
                      {match.result}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--gray-400)",
                        marginTop: 4,
                      }}
                    >
                      M{match.matchNumber}
                    </span>
                    {match.points != null && (
                      <span
                        style={{
                          fontSize: 11,
                          color: config.color,
                          marginTop: 2,
                        }}
                      >
                        +{match.points}pts
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
