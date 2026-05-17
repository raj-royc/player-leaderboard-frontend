import { useEffect, useState } from "react";
import { getPlayers, getPodiums } from "../../api";
import type { Player, PodiumEntry } from "../../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#F5C518", "#B0B0B0", "#CD7F32"];
const PTS = [4, 2, 1];

export default function PointsDistributionChart() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [podiums, setPodiums] = useState<PodiumEntry[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getPlayers(), getPodiums()]).then(([p, pod]) => {
      setPlayers(p);
      setPodiums(pod);
      if (p.length > 0) setSelectedId(p[0].id);
    });
  }, []);

  const selected = podiums.find((p) => p.playerId === selectedId);
  const chartData = selected
    ? [
        {
          name: "1st Place",
          value: selected.firstPlace * PTS[0],
          count: selected.firstPlace,
        },
        {
          name: "2nd Place",
          value: selected.secondPlace * PTS[1],
          count: selected.secondPlace,
        },
        {
          name: "3rd Place",
          value: selected.thirdPlace * PTS[2],
          count: selected.thirdPlace,
        },
      ].filter((d) => d.value > 0)
    : [];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

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
          Points Distribution
        </p>
        <p style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 2 }}>
          Breakdown of how points were earned
        </p>
      </div>
      <div style={{ padding: "16px 20px 20px" }}>
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

        {chartData.length === 0 ? (
          <p
            style={{
              color: "var(--gray-400)",
              fontSize: 14,
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            No data yet
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={600}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} pts`, String(name)]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 8,
              }}
            >
              {chartData.map((entry, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: COLORS[i],
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{ fontSize: 13, color: "var(--gray-600)", flex: 1 }}
                  >
                    {entry.name}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--gray-800)",
                    }}
                  >
                    {entry.value} pts
                  </span>
                  <span style={{ fontSize: 11, color: "var(--gray-400)" }}>
                    ({Math.round((entry.value / total) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
