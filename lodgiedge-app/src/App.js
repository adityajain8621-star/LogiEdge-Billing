import { useState, useCallback } from "react";

import { INIT_CUSTOMERS, INIT_ITEMS } from "./data/seedData";
import S from "./styles/tokens";
import Sidebar         from "./components/layout/Sidebar";
import DashboardModule from "./components/modules/DashboardModule";
import BillingModule   from "./components/modules/BillingModule";
import MasterModule    from "./components/modules/MasterModule";

export default function App() {
  const [customers, setCustomers] = useState(INIT_CUSTOMERS);
  const [items,     setItems]     = useState(INIT_ITEMS);
  const [invoices,  setInvoices]  = useState([]);
  const [module,    setModule]    = useState("dashboard");

  const addInvoice = useCallback((inv) => {
    setInvoices(prev => [...prev, inv]);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: S.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: S.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${S.surface}; }
        ::-webkit-scrollbar-thumb { background: ${S.border}; border-radius: 3px; }
        option { background: #111827; }
      `}</style>

      {/* ── Sidebar ── */}
      <Sidebar
        module={module}
        setModule={setModule}
        invoices={invoices}
        customers={customers}
        items={items}
      />

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: 32, overflowY: "auto", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {module === "dashboard" && <DashboardModule invoices={invoices} customers={customers} />}
          {module === "billing"   && (
            <BillingModule
              customers={customers}
              items={items}
              onInvoiceCreated={inv => { addInvoice(inv); setModule("dashboard"); }}
            />
          )}
          {module === "master" && (
            <MasterModule
              customers={customers} setCustomers={setCustomers}
              items={items}         setItems={setItems}
            />
          )}
        </div>
      </main>
    </div>
  );
}