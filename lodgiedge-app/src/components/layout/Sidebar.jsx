import { LayoutDashboard, Receipt, Package } from "lucide-react";
import S from "../../styles/tokens";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard",   icon: <LayoutDashboard size={18} /> },
  { key: "billing",   label: "New Invoice", icon: <Receipt size={18} /> },
  { key: "master",    label: "Master Data", icon: <Package size={18} /> },
];

export default function Sidebar({ module, setModule, invoices, customers, items }) {
  return (
    <nav style={{
      width: 220,
      background: S.surface,
      borderRight: `1px solid ${S.border}`,
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
      flexShrink: 0,
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: "24px 20px", borderBottom: `1px solid ${S.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: S.accent,
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Receipt size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: S.text, letterSpacing: -0.5 }}>
              LogiEdge
            </div>
            <div style={{ fontSize: 10, color: S.muted, letterSpacing: 1, textTransform: "uppercase" }}>
              Billing
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav Links ── */}
      <div style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{
          fontSize: 10, color: S.muted, fontWeight: 700,
          letterSpacing: 1.2, textTransform: "uppercase",
          padding: "0 8px", marginBottom: 8,
        }}>
          Navigation
        </div>

        {NAV_ITEMS.map(n => {
          const isActive = module === n.key;
          return (
            <button
              key={n.key}
              onClick={() => setModule(n.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: isActive ? `${S.accent}22` : "transparent",
                color: isActive ? S.accent : S.muted,
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                marginBottom: 2,
                transition: "all 0.15s",
              }}
            >
              {n.icon}
              {n.label}
              {n.key === "billing" && (
                <span style={{
                  marginLeft: "auto",
                  background: S.accent,
                  color: "#fff",
                  fontSize: 10,
                  borderRadius: 20,
                  padding: "1px 7px",
                  fontWeight: 700,
                }}>
                  NEW
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Session Summary Footer ── */}
      <div style={{ padding: 16, borderTop: `1px solid ${S.border}` }}>
        <div style={{ background: "#0A0F1A", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: S.muted, marginBottom: 8 }}>Session Summary</div>
          {[
            ["Invoices",   invoices.length],
            ["Customers",  customers.length],
            ["Items",      items.length],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: S.textSub }}>{label}</span>
              <span style={{ fontSize: 12, color: S.text, fontWeight: 700, fontFamily: "monospace" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

    </nav>
  );
}