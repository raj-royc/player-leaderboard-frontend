import { useEffect, useState } from "react";
import { getCumulativeData } from "../../api";
import type { CumulativeData } from "../../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PLAYER_COLORS = [
  "#1A73E8",
  "#E8453C",
  "#34A853",
  "#FBBC04",
  "#9C27B0",
  "#00BCD4",
  "#FF5722",
  "#607D8B",
  "#795548",
  "#E91E63",
  "#3F51B5",
];

export default function CumulativeChart() {
  const [data, setData] = useState<CumulativeData[]>([]);
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCumulativeData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  // Build chart data — one entry per match number
  const allMatches = Array.from(
    new Set(data.flatMap((p) => p.matches.map((m) => m.matchNumber))),
  ).sort((a, b) => a - b);

  const chartData = allMatches.map((matchNum) => {
    const entry: Record<string, number | string> = { match: `M${matchNum}` };
    data.forEach((player) => {
      const match = player.matches.find((m) => m.matchNumber === matchNum);
      if (match) entry[player.playerName] = match.cumulative;
      else {
        // carry forward last known value
        const prev = player.matches.filter((m) => m.matchNumber < matchNum);
        entry[player.playerName] =
          prev.length > 0 ? prev[prev.length - 1].cumulative : 0;
      }
    });
    return entry;
  });

  const togglePlayer = (playerId: number) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(playerId) ? next.delete(playerId) : next.add(playerId);
      return next;
    });
  };

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
          Cumulative Points
        </p>
        <p style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 2 }}>
          Points accumulated over the season
        </p>
      </div>
      {loading ? (
        <p style={{ padding: 20, color: "var(--gray-400)", fontSize: 14 }}>
          Loading...
        </p>
      ) : (
        <div style={{ padding: "16px 20px 20px" }}>
          {/* Player toggles */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 16,
            }}
          >
            {data.map((player, i) => (
              <button
                key={player.playerId}
                onClick={() => togglePlayer(player.playerId)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 12,
                  border: "0.5px solid",
                  borderColor: hidden.has(player.playerId)
                    ? "var(--gray-200)"
                    : PLAYER_COLORS[i % PLAYER_COLORS.length],
                  background: hidden.has(player.playerId)
                    ? "#fff"
                    : PLAYER_COLORS[i % PLAYER_COLORS.length] + "18",
                  color: hidden.has(player.playerId)
                    ? "var(--gray-400)"
                    : PLAYER_COLORS[i % PLAYER_COLORS.length],
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {player.playerName}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1EFF8" />
              <XAxis
                dataKey="match"
                tick={{ fontSize: 10, fill: "#9896A4" }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10, fill: "#9896A4" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "0.5px solid var(--gray-200)",
                  fontSize: 12,
                }}
              />
              {data.map(
                (player, i) =>
                  !hidden.has(player.playerId) && (
                    <Line
                      key={player.playerId}
                      type="monotone"
                      dataKey={player.playerName}
                      stroke={PLAYER_COLORS[i % PLAYER_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      animationDuration={600}
                    />
                  ),
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
