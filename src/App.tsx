import { useState } from "react";
import Header from "./components/Header";
import OverallLeaderboard from "./components/OverallLeaderboard";
import WeeklyLeaderboard from "./components/WeeklyLeaderboard";
import MatchResultCard from "./components/MatchResultCard";
import AbsenceTable from "./components/AbsenceTable";
import PodiumTable from "./components/PodiumTable";
import LogMatchModal from "./components/LogMatchModal";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => setRefreshKey((k) => k + 1);

  return (
    <div>
      <Header />
      <div key={refreshKey}>
        <OverallLeaderboard />
        <WeeklyLeaderboard />
        <MatchResultCard />
        <AbsenceTable />
        <PodiumTable />
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
