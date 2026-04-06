import { useState, useMemo } from "react";
import {
  Search, Filter, X, Eye, ArrowLeft,
  Receipt, BadgeIndianRupee, TrendingUp, Users, ChevronDown,
} from "lucide-react";
import S from "../../styles/tokens";
import { fmt } from "../../utils/helpers";

// ── Inline UI ─────────────────────────────────────────────────

const Badge = ({ children, color = "blue" }) => {
  const colors = { blue: { bg: "#1E3A5F", text: "#60A5FA" }, green: { bg: "#064E3B", text: "#34D399" }, amber: { bg: "#451A03", text: "#FCD34D" }, muted: { bg: "#1F2937", text: "#9CA3AF" } };
  const c = colors[color];
  return <span style={{ backgroundColor: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{children}</span>;
};

const Btn = ({ children, variant = "primary", size = "md", icon, ...props }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: size === "sm" ? 12 : 14, padding: size === "sm" ? "6px 12px" : "10px 18px", transition: "all 0.15s", whiteSpace: "nowrap" };
  const variants = {
    primary: { background: S.accent, color: "#fff" },
    ghost:   { background: "transparent", color: S.textSub, border: `1px solid ${S.border}` },
  };
  return <button style={{ ...base, ...variants[variant] }} {...props}>{icon} {children}</button>;
};

const StatCard = ({ title, value, icon, color = S.accent, subtitle }) => (
  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: S.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>{value}</div>
        {subtitle && <div style={{ fontSize: 12, color: S.textSub, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ background: `${color}22`, borderRadius: 10, padding: 10, color }}>{icon}</div>
    </div>
  </div>
);

const Table = ({ columns, data, emptyMsg }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c.key} style={{ padding: "10px 16px", textAlign: c.right ? "right" : "left", background: "#0A0F1A", color: S.textSub, fontWeight: 600, fontSize: 11, letterSpacing: 0.7, textTransform: "uppercase", borderBottom: `1px solid ${S.border}`, whiteSpace: "nowrap" }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={columns.length} style={{ padding: 32, textAlign: "center", color: S.muted }}>{emptyMsg}</td></tr>
        ) : (
          data.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${S.border}` }}
              onMouseEnter={e => (e.currentTarget.style.background = "#0F1929")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: "12px 16px", color: S.text, textAlign: c.right ? "right" : "left" }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// ── Invoice Detail View ───────────────────────────────────────

function InvoiceDetail({ invoice, onBack }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Btn variant="ghost" icon={<ArrowLeft size={14} />} onClick={onBack}>Back to Dashboard</Btn>
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: S.muted, marginBottom: 4, letterSpacing: 0.5 }}>INVOICE</div>
            <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: S.accent }}>{invoice.id}</div>
            <div style={{ color: S.muted, fontSize: 12, marginTop: 4 }}>{invoice.date} at {invoice.time}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: S.muted, fontSize: 11, marginBottom: 4 }}>BILL TO</div>
            <div style={{ color: S.text, fontWeight: 600 }}>{invoice.customerName}</div>
            {invoice.customerGST && <div style={{ color: S.muted, fontSize: 12 }}>GST: {invoice.customerGST}</div>}
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0A0F1A" }}>
              {["Item", "Rate", "Qty", "Amount"].map((h, i) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: i >= 1 ? "right" : "left", color: S.muted, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((r, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${S.border}` }}>
                <td style={{ padding: "12px 16px", color: S.text }}>{r.name}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: S.textSub, fontFamily: "monospace" }}>{fmt(r.price)}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: S.textSub }}>{r.qty}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: S.text, fontWeight: 600, fontFamily: "monospace" }}>{fmt(r.price * r.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${S.border}`, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 280 }}>
            {[
              ["Subtotal", fmt(invoice.subtotal), false],
              [`GST @ ${invoice.gstRate}%`, invoice.gstAmount > 0 ? fmt(invoice.gstAmount) : "Exempt", false],
              ["Total", fmt(invoice.total), true],
            ].map(([k, v, bold]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: bold ? `1px solid ${S.border}` : "none", marginTop: bold ? 6 : 0 }}>
                <span style={{ color: bold ? S.text : S.muted, fontWeight: bold ? 700 : 400, fontSize: bold ? 16 : 13 }}>{k}</span>
                <span style={{ color: bold ? S.green : S.textSub, fontWeight: bold ? 700 : 400, fontFamily: "monospace", fontSize: bold ? 16 : 13 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────

export default function DashboardModule({ invoices, customers }) {
  const [search,      setSearch]      = useState("");
  const [custFilter,  setCustFilter]  = useState("");
  const [viewInvoice, setViewInvoice] = useState(null);

  const filtered = useMemo(() => {
    return invoices
      .filter(inv => {
        if (search     && !inv.id.toLowerCase().includes(search.toLowerCase())) return false;
        if (custFilter && inv.customerId !== custFilter) return false;
        return true;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [invoices, search, custFilter]);

  const totalRevenue = invoices.reduce((s, i) => s + i.total, 0);
  const totalGST     = invoices.reduce((s, i) => s + i.gstAmount, 0);

  const cols = [
    { key: "id",           label: "Invoice ID",  render: r => <span style={{ fontFamily: "monospace", color: S.accent, fontWeight: 700 }}>{r.id}</span> },
    { key: "customerName", label: "Customer" },
    { key: "date",         label: "Date" },
    { key: "items",        label: "Items",  render: r => <Badge color="muted">{r.items.length} item{r.items.length > 1 ? "s" : ""}</Badge> },
    { key: "gst",          label: "GST",    render: r => <Badge color={r.gstAmount > 0 ? "amber" : "green"}>{r.gstAmount > 0 ? fmt(r.gstAmount) : "Exempt"}</Badge> },
    { key: "total",        label: "Total",  right: true, render: r => <span style={{ fontFamily: "monospace", fontWeight: 700, color: S.green }}>{fmt(r.total)}</span> },
    { key: "actions",      label: "",       render: r => <Btn size="sm" variant="ghost" icon={<Eye size={12} />} onClick={() => setViewInvoice(r)}>View</Btn> },
  ];

  if (viewInvoice) return <InvoiceDetail invoice={viewInvoice} onBack={() => setViewInvoice(null)} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h2 style={{ color: S.text, fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard</h2>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 4, marginBottom: 0 }}>Overview of all billing activity</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard title="Total Invoices" value={invoices.length} icon={<Receipt size={20} />} />
        <StatCard title="Total Revenue"  value={fmt(totalRevenue)} icon={<BadgeIndianRupee size={20} />} color={S.green} subtitle="incl. all invoices" />
        <StatCard title="GST Collected"  value={fmt(totalGST)}    icon={<TrendingUp size={20} />} color={S.amber} />
        <StatCard title="Active Customers" value={customers.filter(c => c.active).length} icon={<Users size={20} />} color="#A78BFA" />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: S.muted }} />
          <input
            placeholder="Search by Invoice ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px 10px 36px", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, color: S.text, fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ position: "relative", minWidth: 200 }}>
          <Filter size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: S.muted, pointerEvents: "none" }} />
          <select value={custFilter} onChange={e => setCustFilter(e.target.value)} style={{ paddingLeft: 32, padding: "10px 32px", appearance: "none", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, color: custFilter ? S.text : S.muted, fontSize: 13, outline: "none", cursor: "pointer", minWidth: 200 }}>
            <option value="">All Customers</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: S.muted, pointerEvents: "none" }} />
        </div>
        {(search || custFilter) && (
          <Btn size="sm" variant="ghost" onClick={() => { setSearch(""); setCustFilter(""); }}>
            <X size={13} /> Clear
          </Btn>
        )}
      </div>

      {/* Table */}
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}` }}>
          <span style={{ color: S.text, fontWeight: 600, fontSize: 14 }}>
            {search || custFilter ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : "Recent Invoices"}
          </span>
        </div>
        <Table
          columns={cols}
          data={filtered}
          emptyMsg={invoices.length === 0 ? "No invoices yet. Create one in the Billing module." : "No invoices match your search."}
        />
      </div>
    </div>
  );
}