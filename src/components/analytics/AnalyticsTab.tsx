import CumulativeChart from "./CumulativeChart";
import RankMovementChart from "./RankMovementChart";
import FormChart from "./FormChart";
import PodiumRateChart from "./PodiumRateChart";
import PointsDistributionChart from "./PointsDistributionChart";

export default function AnalyticsTab() {
  return (
    <div style={{ padding: "0 16px" }}>
      <CumulativeChart />
      <RankMovementChart />
      <FormChart />
      <PodiumRateChart />
      <PointsDistributionChart />

      {/* Coming soon */}
      <div
        style={{
          background: "#fff",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-card)",
          padding: "32px 20px",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 20, marginBottom: 8 }}>📊</p>
        <p style={{ fontSize: 15, fontWeight: 500, color: "var(--gray-800)" }}>
          More Charts Coming Soon
        </p>
        <p
          style={{
            fontSize: 12,
            color: "var(--gray-400)",
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          Head-to-head, team analytics, win rate and more
        </p>
      </div>
    </div>
  );
}
