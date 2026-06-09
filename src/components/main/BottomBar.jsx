import { FONT_TITLE, FONT_MONO, RED } from "../../constants";

export default function BottomBar({
  activeCardsCount,
  onSkipTurn,
  canSkipTurn = true,
  onMarketCardClick,
  onQuarterChange,
  onPriceEditClick,
  onPlayersClick,
}) {
  return (
    <div
      className="bottom-action-bar"
      style={{
        borderTop: "1px solid #181818",
        display: "flex",
        flexShrink: 0,
        background: "#0a0a0a",
      }}
    >
      <button
        className="bottom-action-button bottom-action-skip"
        onClick={onSkipTurn}
        disabled={!canSkipTurn}
        style={{
          flex: 1,
          fontFamily: FONT_TITLE,
          letterSpacing: 1.5,
          background: canSkipTurn ? "#130a0a" : "#141414",
          color: canSkipTurn ? RED : "#444",
          border: `1px solid ${canSkipTurn ? RED + "30" : "#222"}`,
          borderRadius: 4,
          cursor: canSkipTurn ? "pointer" : "default",
        }}
      >
        SIRANı GEÇ
      </button>
      <button
        className="bottom-action-button"
        onClick={onMarketCardClick}
        style={{
          fontFamily: FONT_TITLE,
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
        className="bottom-action-button"
        onClick={onPriceEditClick}
        style={{
          fontFamily: FONT_TITLE,
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
        className="bottom-action-button"
        onClick={onQuarterChange}
        style={{
          fontFamily: FONT_TITLE,
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
        className="bottom-action-button bottom-action-players"
        onClick={onPlayersClick}
        style={{
          fontFamily: FONT_TITLE,
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
