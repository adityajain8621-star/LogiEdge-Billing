export const Table = ({ columns, data, emptyMsg = "No records found." }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{
              padding: "10px 16px", textAlign: c.right ? "right" : "left",
              background: "#0A0F1A", color: S.textSub, fontWeight: 600,
              fontSize: 11, letterSpacing: 0.7, textTransform: "uppercase",
              borderBottom: `1px solid ${S.border}`, whiteSpace: "nowrap",
            }}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: 32, textAlign: "center", color: S.muted }}>
              {emptyMsg}
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottom: `1px solid ${S.border}` }}
              onMouseEnter={e => (e.currentTarget.style.background = "#0F1929")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {columns.map((c) => (
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

