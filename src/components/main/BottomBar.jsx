import { FONT_TITLE, FONT_MONO, RED } from "../../constants";

export default function BottomBar({
  activeCardsCount,
  onAddCard,
  onQuarterChange,
  onPlayersClick,
}) {
  return (
    <div
      style={{
        padding: "8px 12px",
        borderTop: "1px solid #181818",
        display: "flex",
        gap: 8,
        flexShrink: 0,
        background: "#0a0a0a",
      }}
    >
      <button
        onClick={onAddCard}
        style={{
          flex: 1,
          padding: "11px",
          fontFamily: FONT_TITLE,
          fontSize: 14,
          letterSpacing: 2,
          background: "#130a0a",
          color: RED,
          border: `1px solid ${RED}30`,
          borderRadius: 4,
        }}
      >
        + KART EKLE
      </button>
      <button
        onClick={onQuarterChange}
        style={{
          padding: "11px 14px",
          fontFamily: FONT_TITLE,
          fontSize: 12,
          letterSpacing: 1,
          background: "#141414",
          color: "#666",
          border: "1px solid #272727",
          borderRadius: 4,
        }}
      >
        Q GEÇ
      </button>
      <button
        onClick={onPlayersClick}
        style={{
          padding: "11px 14px",
          fontFamily: FONT_TITLE,
          fontSize: 14,
          background: "#141414",
          color: "#666",
          border: "1px solid #272727",
          borderRadius: 4,
        }}
      >
        👥
      </button>
    </div>
  );
}
