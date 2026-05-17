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

const TOP5_COLORS = ["#F5C518", "#378ADD", "#34A853", "#E8453C", "#9C27B0"];

export default function RankMovementChart() {
  const [data, setData] = useState<CumulativeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCumulativeData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  // Find current top 5 by total points
  const top5 = [...data]
    .sort((a, b) => {
      const aTotal =
        a.matches.length > 0 ? a.matches[a.matches.length - 1].cumulative : 0;
      const bTotal =
        b.matches.length > 0 ? b.matches[b.matches.length - 1].cumulative : 0;
      return bTotal - aTotal;
    })
    .slice(0, 5);

  const allMatches = Array.from(
    new Set(data.flatMap((p) => p.matches.map((m) => m.matchNumber))),
  ).sort((a, b) => a - b);

  // For each match, compute rank of top5 players among all players
  const chartData = allMatches.map((matchNum) => {
    const entry: Record<string, number | string> = { match: `M${matchNum}` };

    // Get cumulative points for all players at this match
    const allScores = data.map((player) => {
      const upToNow = player.matches.filter((m) => m.matchNumber <= matchNum);
      const pts =
        upToNow.length > 0 ? upToNow[upToNow.length - 1].cumulative : 0;
      return { name: player.playerName, pts };
    });

    // Sort descending to get ranks
    const sorted = [...allScores].sort((a, b) => b.pts - a.pts);

    top5.forEach((player) => {
      const rankIndex = sorted.findIndex((s) => s.name === player.playerName);
      entry[player.playerName] = rankIndex + 1;
    });

    return entry;
  });

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
          Rank Movement
        </p>
        <p style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 2 }}>
          Top 5 players · lower is better
        </p>
      </div>
      {loading ? (
        <p style={{ padding: 20, color: "var(--gray-400)", fontSize: 14 }}>
          Loading...
        </p>
      ) : (
        <div style={{ padding: "16px 20px 20px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 16,
            }}
          >
            {top5.map((player, i) => (
              <div
                key={player.playerId}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: TOP5_COLORS[i],
                  }}
                />
                <span style={{ fontSize: 11, color: "var(--gray-600)" }}>
                  {player.playerName}
                </span>
              </div>
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
              <YAxis
                reversed
                domain={[1, 11]}
                tick={{ fontSize: 10, fill: "#9896A4" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "0.5px solid var(--gray-200)",
                  fontSize: 12,
                }}
              />
              {top5.map((player, i) => (
                <Line
                  key={player.playerId}
                  type="monotone"
                  dataKey={player.playerName}
                  stroke={TOP5_COLORS[i]}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={600}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
