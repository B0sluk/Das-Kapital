import { FONT_TITLE, FONT_MONO, RED } from "../../constants";

export default function BottomBar({
  activeCardsCount,
  onSkipTurn,
  onMarketCardClick,
  onQuarterChange,
  onPriceEditClick,
  onPlayersClick,
}) {
  return (
    <div
      style={{
        padding: "8px 12px",
        borderTop: "1px solid #181818",
        display: "flex",
        gap: 6,
        flexShrink: 0,
        background: "#0a0a0a",
      }}
    >
      <button
        onClick={onSkipTurn}
        style={{
          flex: 1,
          padding: "11px",
          fontFamily: FONT_TITLE,
          fontSize: 13,
          letterSpacing: 1.5,
          background: "#130a0a",
          color: RED,
          border: `1px solid ${RED}30`,
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        SIRANı GEÇ
      </button>
      <button
        onClick={onMarketCardClick}
        style={{
          padding: "11px 12px",
          fontFamily: FONT_TITLE,
          fontSize: 13,
          background: "#0a0d13",
          color: "#2471a3",
          border: "1px solid #2471a330",
          borderRadius: 4,
          cursor: "pointer",
        }}
        title="Pazar Kartı Satın Al"
      >
        🎴 PAZAR
      </button>
      <button
        onClick={onPriceEditClick}
        style={{
          padding: "11px 12px",
          fontFamily: FONT_TITLE,
          fontSize: 13,
          background: "#141414",
          color: "#aaa",
          border: "1px solid #272727",
          borderRadius: 4,
          cursor: "pointer",
        }}
        title="Fiyatları Düzenle"
      >
        🏷️ FİYAT
      </button>
      <button
        onClick={onQuarterChange}
        style={{
          padding: "11px 12px",
          fontFamily: FONT_TITLE,
          fontSize: 13,
          letterSpacing: 1,
          background: "#141414",
          color: "#aaa",
          border: "1px solid #272727",
          borderRadius: 4,
          cursor: "pointer",
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
          color: "#aaa",
          border: "1px solid #272727",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        👥
      </button>
    </div>
  );
}
