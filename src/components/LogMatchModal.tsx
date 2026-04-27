import { useEffect, useState } from "react";
import { getPlayers, submitMatch } from "../api";
import type { Player } from "../api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LogMatchModal({ onClose, onSuccess }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchNumber, setMatchNumber] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [absent, setAbsent] = useState<string[]>([]);
  const [bonusEnabled, setBonusEnabled] = useState(false);
  const [bonusPoints, setBonusPoints] = useState("");
  const [isLastGame, setIsLastGame] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPlayers().then(setPlayers);
  }, []);

  const podiumIds = [first, second, third].filter(Boolean);

  const handleAbsentToggle = (id: string) => {
    setAbsent((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (!matchNumber || !matchDate || !first || !second || !third) {
      setError("Match number, date, and all three positions are required.");
      return;
    }
    if (new Set([first, second, third]).size < 3) {
      setError("First, second, and third must be different players.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await submitMatch({
        matchNumber: parseInt(matchNumber),
        matchDate,
        firstPlacePlayerId: parseInt(first),
        secondPlacePlayerId: parseInt(second),
        thirdPlacePlayerId: parseInt(third),
        bonusPoints: bonusEnabled && bonusPoints ? parseInt(bonusPoints) : null,
        absentPlayerIds: absent.map(Number),
        isLastGameOfWeek: isLastGame,
      });
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "0.5px solid var(--gray-200)",
    fontSize: 15,
    background: "#fff",
    color: "var(--gray-800)",
    appearance: "none" as const,
    outline: "none",
    marginTop: 6,
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 500,
    color: "var(--gray-600)",
    letterSpacing: "0.4px",
    textTransform: "uppercase" as const,
  };

  const toggleRow = (
    label: string,
    subtitle: string,
    enabled: boolean,
    onToggle: () => void,
    accent: string,
    subtitleColor: string,
    bg: string,
  ) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: bg,
        borderRadius: 14,
        marginBottom: 12,
      }}
    >
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: accent }}>{label}</p>
        <p style={{ fontSize: 12, color: subtitleColor, marginTop: 2 }}>
          {subtitle}
        </p>
      </div>
      <button
        onClick={onToggle}
        style={{
          width: 48,
          height: 28,
          borderRadius: 14,
          border: "none",
          cursor: "pointer",
          background: enabled ? accent : "var(--gray-200)",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: enabled ? 22 : 3,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            display: "block",
          }}
        />
      </button>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(4,44,83,0.4)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 100,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          padding: "24px 20px 40px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: "var(--gray-200)",
            borderRadius: 2,
            margin: "0 auto 20px",
          }}
        />
        <p
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "var(--gray-800)",
            marginBottom: 20,
          }}
        >
          Log a Match
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <p style={labelStyle}>Match No.</p>
            <input
              type="number"
              min="1"
              max="74"
              value={matchNumber}
              onChange={(e) => setMatchNumber(e.target.value)}
              placeholder="e.g. 7"
              style={selectStyle}
            />
          </div>
          <div>
            <p style={labelStyle}>Date</p>
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              style={selectStyle}
            />
          </div>
        </div>

        {(["1st Place", "2nd Place", "3rd Place"] as const).map(
          (label, idx) => {
            const val = [first, second, third][idx];
            const setter = [setFirst, setSecond, setThird][idx];
            return (
              <div key={label} style={{ marginBottom: 12 }}>
                <p style={labelStyle}>{label}</p>
                <select
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Select player</option>
                  {players.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      disabled={
                        podiumIds.includes(String(p.id)) && String(p.id) !== val
                      }
                    >
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          },
        )}

        <div style={{ marginBottom: 16 }}>
          <p style={labelStyle}>Absent Players</p>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}
          >
            {players.map((p) => (
              <button
                key={p.id}
                onClick={() => handleAbsentToggle(String(p.id))}
                disabled={podiumIds.includes(String(p.id))}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 13,
                  border: "0.5px solid",
                  borderColor: absent.includes(String(p.id))
                    ? "var(--blue-400)"
                    : "var(--gray-200)",
                  background: absent.includes(String(p.id))
                    ? "var(--blue-50)"
                    : "#fff",
                  color: absent.includes(String(p.id))
                    ? "var(--blue-800)"
                    : "var(--gray-600)",
                  cursor: podiumIds.includes(String(p.id))
                    ? "not-allowed"
                    : "pointer",
                  opacity: podiumIds.includes(String(p.id)) ? 0.3 : 1,
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {toggleRow(
          "Winner got bonus?",
          "Extra points for 1st place",
          bonusEnabled,
          () => {
            setBonusEnabled((b) => !b);
            setBonusPoints("");
          },
          "var(--blue-800)",
          "var(--blue-600)",
          "var(--blue-50)",
        )}

        {bonusEnabled && (
          <div style={{ marginBottom: 12 }}>
            <p style={labelStyle}>Bonus Points</p>
            <select
              value={bonusPoints}
              onChange={(e) => setBonusPoints(e.target.value)}
              style={selectStyle}
            >
              <option value="">Select bonus</option>
              <option value="1">+1 point</option>
              <option value="2">+2 points</option>
            </select>
          </div>
        )}

        {toggleRow(
          "Last game of the week?",
          "Weekly winner gets +2 pts",
          isLastGame,
          () => setIsLastGame((b) => !b),
          "#7B4F00",
          "#A0652A",
          "#FFF8EE",
        )}

        {isLastGame && (
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              padding: "10px 14px",
              background: "#FFFBEA",
              borderRadius: 10,
              marginBottom: 12,
              marginTop: -4,
            }}
          >
            <span style={{ fontSize: 15 }}>⚠️</span>
            <p style={{ fontSize: 12, color: "#7B4F00", lineHeight: 1.5 }}>
              Marking this as the last game will automatically award 2 bonus
              points to this week's top player.
            </p>
          </div>
        )}

        {error && (
          <p
            style={{
              fontSize: 13,
              color: "#E74C3C",
              background: "#FDEAEA",
              padding: "10px 14px",
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 14,
            border: "none",
            background: submitting
              ? "var(--gray-200)"
              : "linear-gradient(135deg, #185FA5, #378ADD)",
            color: "#fff",
            fontSize: 16,
            fontWeight: 500,
            cursor: submitting ? "not-allowed" : "pointer",
            marginTop: 4,
          }}
        >
          {submitting ? "Submitting..." : "Submit Match"}
        </button>
      </div>
    </div>
  );
}
