import { useState } from "react";
import {
  Plus, X, CheckCircle, ChevronRight, ChevronDown,
  Trash2, ShoppingCart, Building2, AlertCircle, Receipt,
} from "lucide-react";
import S from "../../styles/tokens";
import { generateInvoiceId, fmt } from "../../utils/helpers";

// ── Inline UI ─────────────────────────────────────────────────

const Badge = ({ children, color = "blue" }) => {
  const colors = { blue: { bg: "#1E3A5F", text: "#60A5FA" }, green: { bg: "#064E3B", text: "#34D399" }, amber: { bg: "#451A03", text: "#FCD34D" } };
  const c = colors[color];
  return <span style={{ backgroundColor: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{children}</span>;
};

const Btn = ({ children, variant = "primary", size = "md", icon, ...props }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: size === "sm" ? 12 : 14, padding: size === "sm" ? "6px 12px" : "10px 18px", transition: "all 0.15s", whiteSpace: "nowrap" };
  const variants = {
    primary: { background: S.accent, color: "#fff" },
    ghost:   { background: "transparent", color: S.textSub, border: `1px solid ${S.border}` },
    success: { background: "#064E3B", color: S.green, border: `1px solid #065F46` },
  };
  return <button style={{ ...base, ...variants[variant] }} {...props}>{icon} {children}</button>;
};

const Input = ({ label, error, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, color: S.textSub, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
    <input {...props} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: "10px 14px", color: S.text, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", ...props.style }} />
    {error && <span style={{ fontSize: 12, color: S.red }}>{error}</span>}
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, color: S.textSub, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>}
    <div style={{ position: "relative" }}>
      <select {...props} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: "10px 36px 10px 14px", color: S.text, fontSize: 14, outline: "none", width: "100%", appearance: "none", cursor: "pointer" }}>
        {children}
      </select>
      <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: S.muted, pointerEvents: "none" }} />
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────

export default function BillingModule({ customers, items, onInvoiceCreated }) {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [addingItem, setAddingItem] = useState(false);
  const [pickedItem, setPickedItem] = useState("");
  const [pickedQty, setPickedQty] = useState(1);
  const [success, setSuccess] = useState(null);

  const activeCustomers = customers.filter(c => c.active);
  const activeItems     = items.filter(i => i.active);

  const subtotal       = cart.reduce((s, r) => s + r.price * r.qty, 0);
  const isGSTRegistered = selectedCustomer?.gst;
  const gstAmount      = isGSTRegistered ? 0 : subtotal * 0.18;
  const total          = subtotal + gstAmount;

  const addToCart = () => {
    if (!pickedItem) return;
    const item = items.find(i => i.id === pickedItem);
    setCart(prev => {
      const existing = prev.find(r => r.id === pickedItem);
      if (existing) return prev.map(r => r.id === pickedItem ? { ...r, qty: r.qty + pickedQty } : r);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: pickedQty }];
    });
    setPickedItem(""); setPickedQty(1); setAddingItem(false);
  };

  const generateInvoice = () => {
    const invoice = {
      id: generateInvoiceId(),
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerGST: selectedCustomer.gst,
      items: [...cart],
      subtotal,
      gstRate: isGSTRegistered ? 0 : 18,
      gstAmount,
      total,
      date: new Date().toLocaleDateString("en-IN"),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
    };
    onInvoiceCreated(invoice);
    setSuccess(invoice);
    setCart([]); setSelectedCustomer(null); setStep(1);
  };

  // ── Success Screen ──
  if (success) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "40px 0" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#064E3B", display: "flex", alignItems: "center", justifyContent: "center", color: S.green }}>
        <CheckCircle size={36} />
      </div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: S.text, margin: "0 0 8px", fontSize: 22 }}>Invoice Generated!</h2>
        <p style={{ color: S.muted, margin: 0 }}>Invoice <span style={{ color: S.accent, fontFamily: "monospace", fontWeight: 700 }}>{success.id}</span> has been created.</p>
      </div>
      <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: 24, width: "100%", maxWidth: 480 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Customer", success.customerName], ["Invoice ID", success.id], ["Date", success.date], ["Subtotal", fmt(success.subtotal)], ["GST (18%)", success.gstAmount > 0 ? fmt(success.gstAmount) : "Exempt"], ["Total", fmt(success.total)]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: S.muted, marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 14, color: S.text, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <Btn onClick={() => setSuccess(null)} icon={<Plus size={14} />}>Create Another Invoice</Btn>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h2 style={{ color: S.text, fontSize: 22, fontWeight: 700, margin: 0 }}>New Invoice</h2>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 4, marginBottom: 0 }}>Generate billing invoices for customers</p>
      </div>

      {/* Step Indicator */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {["Select Customer", "Add Items", "Review & Generate"].map((label, i) => {
          const num = i + 1;
          const done   = step > num;
          const active = step === num;
          return (
            <div key={num} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: done ? S.green : active ? S.accent : S.surface, border: `2px solid ${done ? S.green : active ? S.accent : S.border}`, color: done || active ? "#fff" : S.muted, fontSize: 13, fontWeight: 700 }}>
                  {done ? <CheckCircle size={14} /> : num}
                </div>
                <span style={{ fontSize: 11, color: active ? S.accent : S.muted, fontWeight: active ? 700 : 400, whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: 60, height: 2, background: done ? S.green : S.border, margin: "0 8px", marginBottom: 16 }} />}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: Select Customer ── */}
      {step === 1 && (
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: S.text, margin: "0 0 16px", fontSize: 16 }}>Select a Customer</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {activeCustomers.map(c => (
              <div key={c.id} onClick={() => setSelectedCustomer(c)} style={{ padding: "14px 18px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s", border: `1px solid ${selectedCustomer?.id === c.id ? S.accent : S.border}`, background: selectedCustomer?.id === c.id ? `${S.accent}11` : S.surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: S.text, fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ color: S.muted, fontSize: 12, marginTop: 2 }}>{c.id} · {c.address}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Badge color={c.gst ? "blue" : "amber"}>{c.gst ? "GST Registered" : "Unregistered"}</Badge>
                  {selectedCustomer?.id === c.id && <CheckCircle size={16} color={S.accent} />}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <Btn disabled={!selectedCustomer} onClick={() => setStep(2)} style={{ opacity: !selectedCustomer ? 0.4 : 1 }}>
              Continue <ChevronRight size={14} />
            </Btn>
          </div>
        </div>
      )}

      {/* ── STEP 2: Add Items ── */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: `${S.accent}11`, border: `1px solid ${S.accent}33`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <Building2 size={16} color={S.accent} />
            <span style={{ color: S.textSub, fontSize: 12 }}>Billing for: </span>
            <span style={{ color: S.text, fontWeight: 700, fontSize: 14 }}>{selectedCustomer.name}</span>
            <Badge color={selectedCustomer.gst ? "blue" : "amber"}>{selectedCustomer.gst ? "GST Exempt" : "+18% GST applicable"}</Badge>
          </div>

          <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ color: S.text, margin: 0, fontSize: 16 }}>Items</h3>
              <Btn size="sm" icon={<Plus size={13} />} onClick={() => setAddingItem(true)} variant="ghost">Add Item</Btn>
            </div>

            {addingItem && (
              <div style={{ background: S.surface, borderRadius: 10, padding: 16, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 120px auto", gap: 12, alignItems: "end" }}>
                <Select label="Item" value={pickedItem} onChange={e => setPickedItem(e.target.value)}>
                  <option value="">— Select Item —</option>
                  {activeItems.map(i => <option key={i.id} value={i.id}>{i.name} ({fmt(i.price)})</option>)}
                </Select>
                <Input label="Qty" type="number" min={1} value={pickedQty} onChange={e => setPickedQty(+e.target.value)} />
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="sm" onClick={addToCart} disabled={!pickedItem}><CheckCircle size={13} /></Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setAddingItem(false)}><X size={13} /></Btn>
                </div>
              </div>
            )}

            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: 32, color: S.muted }}>
                <ShoppingCart size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                <div>No items added yet. Click "Add Item" to start.</div>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Item", "Price", "Qty", "Amount", ""].map((h, i) => (
                      <th key={i} style={{ padding: "8px 12px", textAlign: i >= 1 ? "right" : "left", color: S.muted, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", borderBottom: `1px solid ${S.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map(r => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${S.border}` }}>
                      <td style={{ padding: "12px 12px", color: S.text }}><div>{r.name}</div><div style={{ fontSize: 11, color: S.muted }}>{r.id}</div></td>
                      <td style={{ padding: "12px 12px", textAlign: "right", color: S.textSub, fontFamily: "monospace" }}>{fmt(r.price)}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right" }}>
                        <input type="number" min={1} value={r.qty} onChange={e => setCart(prev => prev.map(x => x.id === r.id ? { ...x, qty: +e.target.value } : x))} style={{ width: 60, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, padding: "4px 8px", color: S.text, textAlign: "right", fontSize: 13 }} />
                      </td>
                      <td style={{ padding: "12px 12px", textAlign: "right", color: S.text, fontWeight: 600, fontFamily: "monospace" }}>{fmt(r.price * r.qty)}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right" }}>
                        <button onClick={() => setCart(prev => prev.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", color: S.red, cursor: "pointer" }}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
            <Btn disabled={cart.length === 0} onClick={() => setStep(3)} style={{ opacity: cart.length === 0 ? 0.4 : 1 }}>Review Invoice <ChevronRight size={14} /></Btn>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Generate ── */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
            {/* Invoice Header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: S.text, fontFamily: "monospace" }}>INVOICE PREVIEW</div>
                <div style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>{new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: S.muted, fontSize: 11, marginBottom: 4 }}>BILL TO</div>
                <div style={{ color: S.text, fontWeight: 600, fontSize: 14 }}>{selectedCustomer.name}</div>
                <div style={{ color: S.muted, fontSize: 12 }}>{selectedCustomer.address}</div>
                <div style={{ color: S.muted, fontSize: 12 }}>PAN: {selectedCustomer.pan}</div>
                {selectedCustomer.gst && <div style={{ color: S.muted, fontSize: 12 }}>GST: {selectedCustomer.gst}</div>}
              </div>
            </div>

            {/* Items Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0A0F1A" }}>
                  {["#", "Item", "Rate", "Qty", "Amount"].map((h, i) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: i >= 2 ? "right" : "left", color: S.muted, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cart.map((r, i) => (
                  <tr key={r.id} style={{ borderTop: `1px solid ${S.border}` }}>
                    <td style={{ padding: "12px 16px", color: S.muted }}>{i + 1}</td>
                    <td style={{ padding: "12px 16px", color: S.text }}>{r.name}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: S.textSub, fontFamily: "monospace" }}>{fmt(r.price)}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: S.textSub }}>{r.qty}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: S.text, fontWeight: 600, fontFamily: "monospace" }}>{fmt(r.price * r.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${S.border}`, display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: 280 }}>
                {[
                  ["Subtotal", fmt(subtotal), false],
                  isGSTRegistered ? ["GST", "Exempt (Registered)", false] : ["GST @ 18%", fmt(gstAmount), false],
                  ["Total", fmt(total), true],
                ].map(([k, v, bold]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: bold ? `1px solid ${S.border}` : "none", marginTop: bold ? 6 : 0 }}>
                    <span style={{ color: bold ? S.text : S.muted, fontWeight: bold ? 700 : 400, fontSize: bold ? 16 : 13 }}>{k}</span>
                    <span style={{ color: bold ? S.green : S.textSub, fontWeight: bold ? 700 : 400, fontFamily: "monospace", fontSize: bold ? 16 : 13 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GST Notice */}
            {!isGSTRegistered && (
              <div style={{ margin: "0 24px 16px", background: "#451A0322", border: `1px solid ${S.amber}44`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                <AlertCircle size={14} color={S.amber} />
                <span style={{ fontSize: 12, color: S.amber }}>Customer is not GST registered. 18% GST has been applied.</span>
              </div>
            )}
            {isGSTRegistered && (
              <div style={{ margin: "0 24px 16px", background: "#064E3B22", border: `1px solid ${S.green}44`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                <CheckCircle size={14} color={S.green} />
                <span style={{ fontSize: 12, color: S.green }}>Customer is GST registered. GST not applied as per regulations.</span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Btn variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
            <Btn variant="success" onClick={generateInvoice} icon={<Receipt size={14} />}>Generate Invoice</Btn>
          </div>
        </div>
      )}
    </div>
  );
}