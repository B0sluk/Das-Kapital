import { FONT_TITLE, RED } from "../../constants";

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
        padding: "10px 12px",
        paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))",
        borderTop: "2px solid #222",
        display: "flex",
        gap: 6,
        flexShrink: 0,
        background: "#0d0d0d",
        minHeight: 60,
      }}
    >
      <button
        onClick={onSkipTurn}
        style={{
          flex: 2,
          padding: "13px 6px",
          fontFamily: FONT_TITLE,
          fontSize: 14,
          letterSpacing: 1.5,
          background: "#1a0505",
          color: RED,
          border: `1px solid ${RED}50`,
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        SIRAYI GEÇ
      </button>
      <button
        onClick={onMarketCardClick}
        style={{
          flex: 1,
          padding: "13px 4px",
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
          flex: 1,
          padding: "13px 4px",
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
          flex: 1,
          padding: "13px 4px",
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
          flex: 1,
          padding: "13px 4px",
          fontFamily: FONT_TITLE,
          fontSize: 16,
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
