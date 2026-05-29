import { FONT_TITLE, FONT_MONO, RED, GOLD, COMPANIES } from "../../constants";

export default function CompaniesTab({
  cos,
  playerMulis,
  playerCos,
  players,
  activePlayer,
  onSetActivePlayer,
  onBuyShare,
  onSellShare,
}) {
  const currentMuli = playerMulis[activePlayer] || 0;
  const currentShares = playerCos[activePlayer] || {};

  function getTop3(cid) {
    return players
      .map((p) => ({
        name: p,
        shares: (playerCos[p] && playerCos[p][cid]) || 0,
      }))
      .sort((a, b) => b.shares - a.shares)
      .slice(0, 3);
  }

  return (
    <div style={{ padding: "8px 12px" }}>
      {/* Player Selector Carousel */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          padding: "4px 4px 10px",
          background: "#0a0a0a",
          borderBottom: "1px solid #141414",
          marginBottom: 12,
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
          padding: "10px 12px",
          background: "#080808",
          borderRadius: 4,
          border: "1px solid #141414",
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#666", letterSpacing: 1 }}>
          İŞLEM YAPAN: <span style={{ color: RED, fontFamily: FONT_TITLE, fontSize: 13, letterSpacing: 1.5 }}>{activePlayer}</span>
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: GOLD }}>
          Bakiye: <span style={{ fontWeight: 700 }}>{currentMuli.toFixed(2)}M</span>
        </span>
      </div>

      {/* Company List */}
      {COMPANIES.map((c) => {
        const d = cos[c.id];
        const bp = +(d.price * 1.5).toFixed(2);
        const top3 = getTop3(c.id);
        const sharesOwned = currentShares[c.id] || 0;

        return (
          <div
            key={c.id}
            style={{
              background: "#0f0f0f",
              border: "1px solid #1e1e1e",
              borderRadius: 6,
              padding: "13px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 7px",
                  borderRadius: 3,
                  whiteSpace: "nowrap",
                  background: c.color + "18",
                  color: c.color,
                  border: `1px solid ${c.color}45`,
                }}
              >
                {c.code}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: FONT_TITLE,
                    fontSize: 16,
                    letterSpacing: 1.5,
                    color: "#ddd6c8",
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#555",
                    fontFamily: FONT_MONO,
                    letterSpacing: 1,
                  }}
                >
                  {c.tag}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                background: "#080808",
                borderRadius: 4,
                padding: "9px 10px",
                marginBottom: 8,
              }}
            >
              {[
                { label: "HİSSE", val: sharesOwned, color: "#fff" },
                { label: "PAZAR", val: `${d.price}M`, color: GOLD },
                { label: "ALIŞ", val: `${bp}M`, color: "#e74c3c" },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#555",
                      fontFamily: FONT_MONO,
                      letterSpacing: 1,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 18,
                      fontWeight: 700,
                      color: s.color,
                      marginTop: 3,
                    }}
                  >
                    {s.val}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "#080808",
                borderRadius: 4,
                padding: "8px 10px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#3a3a3a",
                  fontFamily: FONT_MONO,
                  letterSpacing: 2,
                  marginBottom: 7,
                }}
              >
                EN BÜYÜK HİSSEDARLAR
              </div>
              {top3.map((sh, i) => (
                <div
                  key={sh.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: i < 2 ? 5 : 0,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        color: ["#e8b84b", "#999", "#6b5a3e"][i],
                        fontWeight: 700,
                      }}
                    >
                      {["①", "②", "③"][i]}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_TITLE,
                        fontSize: 14,
                        letterSpacing: 1.5,
                        color: sh.name === activePlayer ? RED : "#bbb",
                      }}
                    >
                      {sh.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 12,
                      color: sh.shares > 0 ? GOLD : "#333",
                    }}
                  >
                    {sh.shares} hisse
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => onBuyShare(activePlayer, c.id)}
                style={{
                  flex: 1,
                  padding: "9px",
                  fontFamily: FONT_TITLE,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 3,
                  cursor: "pointer",
                }}
              >
                HİSSE AL
              </button>
              <button
                onClick={() => onSellShare(activePlayer, c.id)}
                style={{
                  flex: 1,
                  padding: "9px",
                  fontFamily: FONT_TITLE,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  background: "#141414",
                  color: sharesOwned < 1 ? "#2a2a2a" : "#888",
                  border: sharesOwned < 1 ? "1px solid #1a1a1a" : "1px solid #272727",
                  borderRadius: 3,
                  cursor: sharesOwned < 1 ? "default" : "pointer",
                }}
              >
                HİSSE SAT
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
