import { useState } from "react";
import { Users, Package, Plus, X, CheckCircle, ChevronDown } from "lucide-react";
import S from "../../styles/tokens";
import { nextId } from "../../utils/helpers";

// ── Inline UI (no extra imports needed) ──────────────────────

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue:  { bg: "#1E3A5F", text: "#60A5FA" },
    green: { bg: "#064E3B", text: "#34D399" },
    amber: { bg: "#451A03", text: "#FCD34D" },
    muted: { bg: "#1F2937", text: "#9CA3AF" },
  };
  const c = colors[color];
  return (
    <span style={{ backgroundColor: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
};

const Input = ({ label, error, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, color: S.textSub, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
    <input
      {...props}
      style={{ background: S.surface, border: `1px solid ${error ? S.red : S.border}`, borderRadius: 8, padding: "10px 14px", color: S.text, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", ...props.style }}
      onFocus={e => (e.target.style.borderColor = S.accent)}
      onBlur={e => (e.target.style.borderColor = error ? S.red : S.border)}
    />
    {error && <span style={{ fontSize: 12, color: S.red }}>{error}</span>}
  </div>
);

const Select = ({ label, children, error, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, color: S.textSub, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
    <div style={{ position: "relative" }}>
      <select {...props} style={{ background: S.surface, border: `1px solid ${error ? S.red : S.border}`, borderRadius: 8, padding: "10px 36px 10px 14px", color: S.text, fontSize: 14, outline: "none", width: "100%", appearance: "none", cursor: "pointer", ...props.style }}>
        {children}
      </select>
      <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: S.muted, pointerEvents: "none" }} />
    </div>
    {error && <span style={{ fontSize: 12, color: S.red }}>{error}</span>}
  </div>
);

const Btn = ({ children, variant = "primary", size = "md", icon, ...props }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: size === "sm" ? 12 : 14, padding: size === "sm" ? "6px 12px" : "10px 18px", transition: "all 0.15s", whiteSpace: "nowrap" };
  const variants = {
    primary: { background: S.accent, color: "#fff" },
    ghost:   { background: "transparent", color: S.textSub, border: `1px solid ${S.border}` },
  };
  return <button style={{ ...base, ...variants[variant] }} {...props}>{icon} {children}</button>;
};

const Table = ({ columns, data, emptyMsg = "No records found." }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c.key} style={{ padding: "10px 16px", textAlign: c.right ? "right" : "left", background: "#0A0F1A", color: S.textSub, fontWeight: 600, fontSize: 11, letterSpacing: 0.7, textTransform: "uppercase", borderBottom: `1px solid ${S.border}`, whiteSpace: "nowrap" }}>
              {c.label}
            </th>
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

// ── Main Component ────────────────────────────────────────────

export default function MasterModule({ customers, setCustomers, items, setItems }) {
  const [tab, setTab] = useState("customers");
  const [showCustForm, setShowCustForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [custForm, setCustForm] = useState({ name: "", address: "", pan: "", gst: "", active: true });
  const [itemForm, setItemForm] = useState({ name: "", price: "", active: true });
  const [errors, setErrors] = useState({});

  const validateCust = () => {
    const e = {};
    if (!custForm.name.trim()) e.name = "Name is required";
    if (!custForm.address.trim()) e.address = "Address is required";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(custForm.pan)) e.pan = "Invalid PAN (e.g. ABCDE1234F)";
    if (custForm.gst && !/^\d{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(custForm.gst)) e.gst = "Invalid GST format";
    return e;
  };

  const validateItem = () => {
    const e = {};
    if (!itemForm.name.trim()) e.name = "Name is required";
    if (!itemForm.price || isNaN(itemForm.price) || +itemForm.price <= 0) e.price = "Valid price required";
    return e;
  };

  const addCustomer = () => {
    const e = validateCust();
    if (Object.keys(e).length) { setErrors(e); return; }
    setCustomers(prev => [...prev, { id: nextId("C", prev), name: custForm.name.trim(), address: custForm.address.trim(), pan: custForm.pan.toUpperCase(), gst: custForm.gst.toUpperCase(), active: custForm.active }]);
    setCustForm({ name: "", address: "", pan: "", gst: "", active: true });
    setErrors({});
    setShowCustForm(false);
  };

  const addItem = () => {
    const e = validateItem();
    if (Object.keys(e).length) { setErrors(e); return; }
    setItems(prev => [...prev, { id: nextId("IT", prev), name: itemForm.name.trim(), price: +itemForm.price, active: itemForm.active }]);
    setItemForm({ name: "", price: "", active: true });
    setErrors({});
    setShowItemForm(false);
  };

  const custCols = [
    { key: "id", label: "Customer ID" },
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "pan", label: "PAN" },
    { key: "gst", label: "GST Number", render: r => r.gst ? <span style={{ fontFamily: "monospace", fontSize: 12 }}>{r.gst}</span> : <span style={{ color: S.muted }}>—</span> },
    { key: "status", label: "Status", render: r => <Badge color={r.active ? "green" : "muted"}>{r.active ? "Active" : "Inactive"}</Badge> },
    { key: "gstReg", label: "GST Reg.", render: r => <Badge color={r.gst ? "blue" : "amber"}>{r.gst ? "Registered" : "Unregistered"}</Badge> },
  ];

  const itemCols = [
    { key: "id", label: "Item Code" },
    { key: "name", label: "Item Name" },
    { key: "price", label: "Selling Price", right: true, render: r => <span style={{ fontFamily: "monospace" }}>₹{r.price.toLocaleString("en-IN")}</span> },
    { key: "status", label: "Status", render: r => <Badge color={r.active ? "green" : "muted"}>{r.active ? "Active" : "Inactive"}</Badge> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ color: S.text, fontSize: 22, fontWeight: 700, margin: 0 }}>Master Data</h2>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4, marginBottom: 0 }}>Manage customers and items</p>
        </div>
        {tab === "customers" && <Btn icon={<Plus size={15} />} onClick={() => { setShowCustForm(true); setErrors({}); }}>Add Customer</Btn>}
        {tab === "items"     && <Btn icon={<Plus size={15} />} onClick={() => { setShowItemForm(true); setErrors({}); }}>Add Item</Btn>}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: S.card, padding: 4, borderRadius: 10, width: "fit-content", border: `1px solid ${S.border}` }}>
        {[{ key: "customers", label: "Customers", icon: <Users size={14} /> }, { key: "items", label: "Items", icon: <Package size={14} /> }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: tab === t.key ? S.accent : "transparent", color: tab === t.key ? "#fff" : S.textSub, transition: "all 0.15s" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Add Customer Form */}
      {showCustForm && tab === "customers" && (
        <div style={{ background: S.card, border: `1px solid ${S.accent}44`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ color: S.text, margin: 0, fontSize: 16, fontWeight: 600 }}>New Customer</h3>
            <button onClick={() => setShowCustForm(false)} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer" }}><X size={18} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Company Name" value={custForm.name} onChange={e => setCustForm(p => ({ ...p, name: e.target.value }))} error={errors.name} placeholder="e.g. Acme Pvt. Ltd." />
            <Input label="Address" value={custForm.address} onChange={e => setCustForm(p => ({ ...p, address: e.target.value }))} error={errors.address} placeholder="City, State" />
            <Input label="PAN Number" value={custForm.pan} onChange={e => setCustForm(p => ({ ...p, pan: e.target.value.toUpperCase() }))} error={errors.pan} placeholder="ABCDE1234F" maxLength={10} />
            <Input label="GST Number (optional)" value={custForm.gst} onChange={e => setCustForm(p => ({ ...p, gst: e.target.value.toUpperCase() }))} error={errors.gst} placeholder="Leave blank if unregistered" maxLength={15} />
            <Select label="Status" value={custForm.active} onChange={e => setCustForm(p => ({ ...p, active: e.target.value === "true" }))}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowCustForm(false)}>Cancel</Btn>
            <Btn onClick={addCustomer} icon={<CheckCircle size={14} />}>Save Customer</Btn>
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {showItemForm && tab === "items" && (
        <div style={{ background: S.card, border: `1px solid ${S.accent}44`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ color: S.text, margin: 0, fontSize: 16, fontWeight: 600 }}>New Item</h3>
            <button onClick={() => setShowItemForm(false)} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer" }}><X size={18} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Item Name" value={itemForm.name} onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))} error={errors.name} placeholder="e.g. Keyboard" />
            <Input label="Selling Price (₹)" type="number" value={itemForm.price} onChange={e => setItemForm(p => ({ ...p, price: e.target.value }))} error={errors.price} placeholder="0.00" />
            <Select label="Status" value={itemForm.active} onChange={e => setItemForm(p => ({ ...p, active: e.target.value === "true" }))}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowItemForm(false)}>Cancel</Btn>
            <Btn onClick={addItem} icon={<CheckCircle size={14} />}>Save Item</Btn>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
        {tab === "customers" && <Table columns={custCols} data={customers} emptyMsg="No customers found." />}
        {tab === "items"     && <Table columns={itemCols} data={items}     emptyMsg="No items found." />}
      </div>
    </div>
  );
}