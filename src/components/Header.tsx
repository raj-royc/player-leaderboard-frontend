export default function Header() {
  return (
    <div
      style={{
        padding: "32px 20px 16px",
        background: "linear-gradient(160deg, #185FA5 0%, #378ADD 100%)",
        borderRadius: "0 0 28px 28px",
        marginBottom: "20px",
      }}
    >
      <p
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 28,
          color: "#fff",
          letterSpacing: "-0.3px",
          lineHeight: 1.2,
        }}
      >
        The Jua Project
      </p>
      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.7)",
          marginTop: 4,
          letterSpacing: "0.5px",
        }}
      >
        by Reaper
      </p>
    </div>
  );
}
