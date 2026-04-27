import { useEffect, useState } from "react";
import { getAbsences } from "../api";
import type { AbsenceEntry } from "../api";

export default function AbsenceTable() {
  const [data, setData] = useState<AbsenceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAbsences()
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
          Absences
        </p>
        <p style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 2 }}>
          Ineligible after 14 missed
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
              No absences recorded yet.
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
              <p
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: entry.ineligible ? "#C0392B" : "var(--gray-800)",
                }}
              >
                {entry.playerName}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color:
                      entry.absenceCount > 10
                        ? "#E74C3C"
                        : entry.absenceCount > 7
                          ? "#E67E22"
                          : "var(--gray-600)",
                  }}
                >
                  {entry.absenceCount}
                </span>
                <span style={{ fontSize: 11, color: "var(--gray-400)" }}>
                  / 74
                </span>
                {entry.ineligible && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#E74C3C",
                      background: "#FDEAEA",
                      padding: "2px 6px",
                      borderRadius: 6,
                    }}
                  >
                    out
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
