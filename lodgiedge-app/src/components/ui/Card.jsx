import { TrendingUp } from "lucide-react";

export const Card = ({ title, subtitle, icon, value, color = S.accent, trend }) => (
  <div style={{
    background: S.card, border: `1px solid ${S.border}`, borderRadius: 12,
    padding: 20, display: "flex", flexDirection: "column", gap: 12,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: S.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>
          {title}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>{value}</div>
        {subtitle && <div style={{ fontSize: 12, color: S.textSub, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ background: `${color}22`, borderRadius: 10, padding: 10, color }}>{icon}</div>
    </div>
    {trend !== undefined && (
      <div style={{ fontSize: 12, color: trend >= 0 ? S.green : S.red, display: "flex", alignItems: "center", gap: 4 }}>
        <TrendingUp size={12} /> {trend >= 0 ? "+" : ""}{trend}% this session
      </div>
    )}
  </div>
);