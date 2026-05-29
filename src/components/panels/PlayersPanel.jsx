import { FONT_TITLE, RED, MOCK_PLAYERS } from "../../constants";
import { PanelHeader } from "../shared/Common";

export default function PlayersPanel({ onClose, onSend }) {
  return (
    <>
      <PanelHeader title="OYUNCULAR" onClose={onClose} />
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        {MOCK_PLAYERS.map((p) => (
          <div
            key={p}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "13px 14px",
              background: "#0f0f0f",
              border: "1px solid #1e1e1e",
              borderRadius: 4,
              marginBottom: 8,
            }}
          >
            <span
              style={{ fontFamily: FONT_TITLE, fontSize: 17, letterSpacing: 2 }}
            >
              {p}
            </span>
            <button
              onClick={() => onSend(p)}
              style={{
                padding: "7px 16px",
                fontFamily: FONT_TITLE,
                fontSize: 13,
                letterSpacing: 1,
                background: RED,
                color: "#fff",
                border: "none",
                borderRadius: 3,
              }}
            >
              GÖNDER →
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
