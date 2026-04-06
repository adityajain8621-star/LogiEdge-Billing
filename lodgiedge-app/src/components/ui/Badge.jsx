// ─── Badge.jsx ───────────────────────────────────────────────
import S from "../../styles/tokens";

export const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue:  { bg: "#1E3A5F", text: "#60A5FA" },
    green: { bg: "#064E3B", text: "#34D399" },
    amber: { bg: "#451A03", text: "#FCD34D" },
    red:   { bg: "#450A0A", text: "#F87171" },
    muted: { bg: "#1F2937", text: "#9CA3AF" },
  };
  const c = colors[color];
  return (
    <span style={{
      backgroundColor: c.bg, color: c.text,
      padding: "2px 10px", borderRadius: 20, fontSize: 11,
      fontWeight: 600, letterSpacing: 0.5, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
};


