import { useState } from "react";
import Header from "./components/Header";
import OverallLeaderboard from "./components/OverallLeaderboard";
import WeeklyLeaderboard from "./components/WeeklyLeaderboard";
import AbsenceTable from "./components/AbsenceTable";
import PodiumTable from "./components/PodiumTable";
import MatchResultCard from "./components/MatchResultCard";
import LogMatchModal from "./components/LogMatchModal";
import AnalyticsTab from "./components/analytics/AnalyticsTab";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"stats" | "analytics">("stats");

  const handleSuccess = () => setRefreshKey((k) => k + 1);

  return (
    <div>
      <Header />

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          margin: "0 16px 20px",
          background: "var(--gray-100)",
          borderRadius: 14,
          padding: 4,
        }}
      >
        <button
          onClick={() => setActiveTab("stats")}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 11,
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
            background: activeTab === "stats" ? "#fff" : "transparent",
            color:
              activeTab === "stats" ? "var(--blue-600)" : "var(--gray-400)",
            boxShadow:
              activeTab === "stats" ? "0 1px 4px rgba(24,95,165,0.12)" : "none",
            transition: "all 0.2s",
          }}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 11,
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
            background: activeTab === "analytics" ? "#fff" : "transparent",
            color:
              activeTab === "analytics" ? "var(--blue-600)" : "var(--gray-400)",
            boxShadow:
              activeTab === "analytics"
                ? "0 1px 4px rgba(24,95,165,0.12)"
                : "none",
            transition: "all 0.2s",
          }}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div key={refreshKey}>
        {activeTab === "stats" && (
          <>
            <OverallLeaderboard />
            <WeeklyLeaderboard />
            <MatchResultCard />
            <AbsenceTable />
            <PodiumTable />
          </>
        )}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>

      {/* FAB */}
      <button
        onClick={() => setModalOpen(true)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 20,
          background: "linear-gradient(135deg, #185FA5, #378ADD)",
          color: "#fff",
          border: "none",
          borderRadius: 20,
          padding: "14px 22px",
          fontSize: 15,
          fontWeight: 500,
          boxShadow: "var(--shadow-fab)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 50,
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> Log a Match
      </button>

      {modalOpen && (
        <LogMatchModal
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
