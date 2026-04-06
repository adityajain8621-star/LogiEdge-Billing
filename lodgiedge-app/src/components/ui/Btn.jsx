export const Btn = ({ children, variant = "primary", size = "md", icon, ...props }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
    fontSize: size === "sm" ? 12 : 14,
    padding: size === "sm" ? "6px 12px" : "10px 18px",
    transition: "all 0.15s", whiteSpace: "nowrap",
  };
  const variants = {
    primary: { background: S.accent,      color: "#fff" },
    ghost:   { background: "transparent", color: S.textSub, border: `1px solid ${S.border}` },
    danger:  { background: "#450A0A",     color: S.red,  border: `1px solid #7F1D1D` },
    success: { background: "#064E3B",     color: S.green, border: `1px solid #065F46` },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} {...props}>
      {icon} {children}
    </button>
  );
};