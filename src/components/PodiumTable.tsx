import { useEffect, useState } from "react";
import { getPodiums } from "../api";
import type { PodiumEntry } from "../api";

export default function PodiumTable() {
  const [data, setData] = useState<PodiumEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPodiums()
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
          Podium Finishes
        </p>
      </div>

      {loading ? (
        <p style={{ padding: 20, color: "var(--gray-400)", fontSize: 14 }}>
          Loading...
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--blue-50)" }}>
              <th
                style={{
                  padding: "10px 20px",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--blue-800)",
                }}
              >
                Player
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  fontSize: 16,
                  width: 48,
                }}
              >
                🥇
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  fontSize: 16,
                  width: 48,
                }}
              >
                🥈
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  fontSize: 16,
                  width: 48,
                }}
              >
                🥉
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: 20,
                    color: "var(--gray-400)",
                    fontSize: 14,
                  }}
                >
                  No matches played yet.
                </td>
              </tr>
            )}
            {data.map((entry, i) => (
              <tr
                key={entry.playerId}
                style={{
                  borderTop: "0.5px solid var(--gray-100)",
                  background: i % 2 === 0 ? "#fff" : "var(--gray-50)",
                }}
              >
                <td
                  style={{
                    padding: "12px 20px",
                    fontSize: 15,
                    color: "var(--gray-800)",
                  }}
                >
                  {entry.playerName}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#B8860B",
                  }}
                >
                  {entry.firstPlace}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--gray-500)",
                  }}
                >
                  {entry.secondPlace}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#A0522D",
                  }}
                >
                  {entry.thirdPlace}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
