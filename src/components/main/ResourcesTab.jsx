import { FONT_TITLE, FONT_MONO, RED, GOLD, RESOURCES } from "../../constants";

export default function ResourcesTab({
  res,
  playerMulis,
  playerRes,
  players,
  activePlayer,
  onSetActivePlayer,
  onBuyRes,
  onSellRes,
  onEarnRes,
  onSpendRes,
}) {
  const currentMuli = playerMulis[activePlayer] || 0;
  const currentRes = playerRes[activePlayer] || {};

  return (
    <>
      {/* Player Selector Carousel */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          padding: "10px 16px",
          background: "#0d0d0d",
          borderBottom: "1px solid #141414",
          scrollbarWidth: "none",
        }}
      >
        {players.map((p) => {
          const isSelected = activePlayer === p;
          return (
            <button
              key={p}
              onClick={() => onSetActivePlayer(p)}
              style={{
                padding: "6px 12px",
                borderRadius: 4,
                background: isSelected ? RED : "#141414",
                color: isSelected ? "#fff" : "#888",
                border: `1px solid ${isSelected ? RED : "#252525"}`,
                fontFamily: FONT_TITLE,
                fontSize: 12,
                letterSpacing: 1.5,
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {p} {p === "SEN" && "(SEN)"}
            </button>
          );
        })}
      </div>

      {/* Active Player Stats Banner */}
      <div
        style={{
          padding: "10px 16px",
          background: "#080808",
          borderBottom: "1px solid #141414",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: "#666",
            letterSpacing: 1,
          }}
        >
          İŞLEM YAPAN:{" "}
          <span
            style={{
              color: RED,
              fontFamily: FONT_TITLE,
              fontSize: 13,
              letterSpacing: 1.5,
            }}
          >
            {activePlayer}
          </span>
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: GOLD }}>
          Bakiye:{" "}
          <span style={{ fontWeight: 700 }}>{Math.floor(currentMuli)}M</span>
        </span>
      </div>

      {/* Resource List */}
      {RESOURCES.map((r) => {
        const d = res[r.id];
        const bp = Math.round(d.base * 1.5);
        const amount = currentRes[r.id] || 0;
        const isStatusDisabled = r.id === "status"; // Status kaynağı devre dışı

        return (
          <div
            key={r.id}
            style={{
              padding: "11px 16px",
              borderBottom: "1px solid #141414",
              opacity: isStatusDisabled ? 0.5 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 7,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONT_TITLE,
                    fontSize: 17,
                    letterSpacing: 2,
                    color: "#ddd6c8",
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: "#666",
                    marginTop: 1,
                  }}
                >
                  AL <span style={{ color: GOLD }}>{bp}M</span>
                  {"  "}SAT{" "}
                  <span style={{ color: GOLD }}>{d.base}M</span>
                  {d.buys % 3 !== 0 && d.buys > 0 && (
                    <span style={{ color: "#e74c3c", marginLeft: 8 }}>
                      ↑{d.buys % 3}/3
                    </span>
                  )}
                  {d.sells % 3 !== 0 && d.sells > 0 && (
                    <span style={{ color: "#3498db", marginLeft: 8 }}>
                      ↓{d.sells % 3}/3
                    </span>
                  )}
                </div>
              </div>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 30,
                  fontWeight: 700,
                  color: amount > 0 ? "#fff" : "#2a2a2a",
                  lineHeight: 1,
                }}
              >
                {amount}
              </span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[
                {
                  label: "AL",
                  fn: () => onBuyRes(activePlayer, r.id),
                  bg: RED,
                  cl: "#fff",
                  br: "none",
                  disabled: isStatusDisabled,
                },
                {
                  label: "SAT",
                  fn: () => onSellRes(activePlayer, r.id),
                  bg: "#141414",
                  cl: amount < 1 ? "#2a2a2a" : "#999",
                  br: "1px solid #272727",
                  disabled: false,
                },
                {
                  label: "+EARN",
                  fn: () => onEarnRes(activePlayer, r.id),
                  bg: "#091a10",
                  cl: "#2ecc71",
                  br: "1px solid #2ecc7120",
                  disabled: false,
                },
                {
                  label: "−SPEND",
                  fn: () => onSpendRes(activePlayer, r.id),
                  bg: "#180c07",
                  cl: amount < 1 ? "#2a1508" : "#e67e22",
                  br: "1px solid #e67e2220",
                  disabled: false,
                },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.fn}
                  disabled={btn.disabled}
                  style={{
                    flex: 1,
                    padding: "7px 0",
                    fontSize: 11,
                    fontFamily: FONT_TITLE,
                    letterSpacing: 1,
                    background: btn.disabled ? "#1a1a1a" : btn.bg,
                    color: btn.disabled ? "#444" : btn.cl,
                    border: btn.br,
                    borderRadius: 3,
                    cursor: btn.disabled ? "not-allowed" : "pointer",
                    opacity: btn.disabled ? 0.5 : 1,
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
