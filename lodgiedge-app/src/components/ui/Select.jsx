import { ChevronDown } from "lucide-react";

export const Select = ({ label, children, error, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label style={{ fontSize: 12, color: S.textSub, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label}
      </label>
    )}
    <div style={{ position: "relative" }}>
      <select
        {...props}
        style={{
          background: S.surface, border: `1px solid ${error ? S.red : S.border}`,
          borderRadius: 8, padding: "10px 36px 10px 14px", color: S.text, fontSize: 14,
          outline: "none", width: "100%", appearance: "none", cursor: "pointer",
          ...props.style,
        }}
      >
        {children}
      </select>
      <ChevronDown size={14} style={{
        position: "absolute", right: 12, top: "50%",
        transform: "translateY(-50%)", color: S.muted, pointerEvents: "none",
      }} />
    </div>
    {error && <span style={{ fontSize: 12, color: S.red }}>{error}</span>}
  </div>
);

