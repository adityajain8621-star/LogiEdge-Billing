# LogiEdge Billing 🧾

A clean, dark-themed billing and invoice management dashboard built with **React.js**. Manage customers, items, and generate GST-aware invoices — all in one place.

---

## 🚀 Getting Started

### 1. Clone or create the project

```bash
npx create-react-app logiedge-billing
cd logiedge-billing
```

### 2. Install dependencies

```bash
npm install lucide-react
```

### 3. Add the source files

Create the following folder structure inside `src/`:

```
src/
├── components/
│   ├── layout/
│   │   └── Sidebar.jsx
│   └── modules/
│       ├── DashboardModule.jsx
│       ├── BillingModule.jsx
│       └── MasterModule.jsx
├── data/
│   └── seedData.js
├── styles/
│   └── tokens.js
├── utils/
│   └── helpers.js
├── App.jsx
└── index.js
```

### 4. Run the app

```bash
npm start
```

App will open at `http://localhost:3000`

---

## 📦 Features

- **Dashboard** — View all generated invoices, filter by customer or invoice ID, and see a full invoice detail view
- **New Invoice (Billing)** — 3-step invoice wizard: select customer → add items → review & generate
- **Master Data** — Add and manage customers (with PAN & GST validation) and items
- **GST Logic** — GST registered customers are automatically exempt; unregistered customers are charged 18% GST
- **Session Summary** — Live count of invoices, customers, and items shown in the sidebar

---

## 🛠️ Tech Stack

| Tech | Usage |
|---|---|
| React.js 18 | UI & state management |
| lucide-react | Icons |
| Intl API | Indian Rupee formatting |
| Inline styles | Theming via design tokens |

---

## 🎨 Design Tokens (`src/styles/tokens.js`)

| Token | Value | Usage |
|---|---|---|
| `bg` | `#07090F` | App background |
| `surface` | `#0D1117` | Sidebar, inputs |
| `card` | `#111827` | Cards, tables |
| `accent` | `#3B82F6` | Primary blue |
| `green` | `#10B981` | Success, totals |
| `amber` | `#F59E0B` | Warnings, GST |
| `red` | `#EF4444` | Errors, delete |

---

## 📁 File Responsibilities

| File | Responsibility |
|---|---|
| `App.jsx` | Root layout, global state (customers, items, invoices) |
| `Sidebar.jsx` | Navigation + session summary |
| `DashboardModule.jsx` | Invoice list, filters, detail view, stat cards |
| `BillingModule.jsx` | 3-step invoice creation wizard |
| `MasterModule.jsx` | Customer & item CRUD with validation |
| `seedData.js` | Pre-loaded demo customers and items |
| `helpers.js` | `fmt()`, `nextId()`, `generateInvoiceId()` utilities |
| `tokens.js` | Global color/style design tokens |

---

## 📋 GST Logic

```
Customer is GST Registered  →  GST = ₹0 (Exempt)
Customer is Unregistered    →  GST = Subtotal × 18%
Total = Subtotal + GST
```

---

## 👨‍💻 Author

**Aditya**
B.Tech CSE — JECRC Foundation, Jaipur
[GitHub](https://github.com) · [LinkedIn](https://linkedin.com)

---

## 📄 License

This project is for academic and portfolio purposes.
