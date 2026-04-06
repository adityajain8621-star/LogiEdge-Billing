export const Input = ({ label, error, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label style={{ fontSize: 12, color: S.textSub, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label}
      </label>
    )}
    <input
      {...props}
      style={{
        background: S.surface, border: `1px solid ${error ? S.red : S.border}`,
        borderRadius: 8, padding: "10px 14px", color: S.text, fontSize: 14,
        outline: "none", transition: "border-color 0.2s",
        width: "100%", boxSizing: "border-box",
        ...props.style,
      }}
      onFocus={e => (e.target.style.borderColor = S.accent)}
      onBlur={e => (e.target.style.borderColor = error ? S.red : S.border)}
    />
    {error && <span style={{ fontSize: 12, color: S.red }}>{error}</span>}
  </div>
);

