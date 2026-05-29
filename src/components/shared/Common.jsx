import { FONT_TITLE, FONT_MONO, RED } from "../../constants";

export function PanelHeader({ title, onClose }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #181818",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: FONT_TITLE,
          fontSize: 20,
          letterSpacing: 3,
          color: RED,
        }}
      >
        {title}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "1px solid #272727",
          color: "#666",
          borderRadius: 4,
          padding: "4px 12px",
          fontSize: 12,
          fontFamily: "'JetBrains Mono',monospace",
        }}
      >
        ✕ KAPAT
      </button>
    </div>
  );
}

export function AdjBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        background: "#141414",
        border: "1px solid #2a2a2a",
        borderRadius: 4,
        color: "#888",
        fontSize: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        fontFamily: "'JetBrains Mono',monospace",
      }}
    >
      {children}
    </button>
  );
}
