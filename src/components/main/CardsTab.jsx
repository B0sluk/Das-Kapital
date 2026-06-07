import { FONT_TITLE, FONT_MONO, RED, ALL_CARDS } from "../../constants";

export default function CardsTab({
  activeCards,
  cardSearch,
  cardFilter,
  onCardSearch,
  onCardFilter,
  onToggleCard,
  onToggleUsed,
  onMoneyLossClick,
}) {
  const filteredCards = ALL_CARDS.filter((c) => {
    const matchQ = c.name.toLowerCase().includes(cardSearch.toLowerCase());
    const matchF =
      cardFilter === "all" ||
      (cardFilter === "policy" && c.type === "policy") ||
      (cardFilter === "event" && c.type === "event");
    return matchQ && matchF;
  });

  // Get market cards from active cards
  const marketCards = activeCards.filter((ac) => ac.type === "market");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #141414",
          flexShrink: 0,
          background: "#0d0d0d",
        }}
      >
        <input
          value={cardSearch}
          onChange={(e) => onCardSearch(e.target.value)}
          placeholder="Kart adı ara..."
          style={{
            width: "100%",
            background: "#111",
            border: "1px solid #252525",
            borderRadius: 4,
            padding: "8px 12px",
            color: "#ddd",
            fontSize: 13,
            fontFamily: FONT_MONO,
            marginBottom: 8,
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["all", "TÜMÜ"],
            ["policy", "POLİTİKA"],
            ["event", "OLAY"],
          ].map(([f, label]) => (
            <button
              key={f}
              onClick={() => onCardFilter(f)}
              style={{
                flex: 1,
                padding: "5px",
                fontFamily: FONT_TITLE,
                fontSize: 12,
                letterSpacing: 1,
                background: cardFilter === f ? RED : "#141414",
                color: cardFilter === f ? "#fff" : "#666",
                border: cardFilter === f ? "none" : "1px solid #252525",
                borderRadius: 3,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* MARKET CARDS SECTION */}
      {marketCards.length > 0 && (
        <div
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid #1a1a1a",
            background: "#0a0d10",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#8b735660",
              fontFamily: FONT_MONO,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            PAZAR KARTLARI
          </div>
          {marketCards.map((mc) => (
            <div
              key={mc.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 5,
                padding: "7px 9px",
                background: "#111",
                borderRadius: 3,
                border: "1px solid #2a2414",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 9,
                    color: "#8b7355",
                    fontFamily: FONT_MONO,
                    marginRight: 7,
                  }}
                >
                  PAZAR
                </span>
                <span
                  style={{
                    fontFamily: FONT_TITLE,
                    fontSize: 13,
                    letterSpacing: 1,
                  }}
                >
                  {mc.name}
                </span>
              </div>
              <button
                onClick={() => onToggleCard(mc.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#444",
                  fontSize: 14,
                  padding: "0 4px",
                  lineHeight: 1,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {activeCards.length > 0 && (
        <div
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid #1a1a1a",
            background: "#0a0f0a",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#2ecc7160",
              fontFamily: FONT_MONO,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            AKTİF
          </div>
          {activeCards.map((ac) => {
            const card = ALL_CARDS.find((c) => c.id === ac.id) || ac;
            return (
              <div
                key={ac.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                  padding: "7px 9px",
                  background: "#111",
                  borderRadius: 3,
                  border: "1px solid #1e2e1e",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 9,
                      color:
                        card.type === "policy"
                          ? "#2471a3"
                          : card.type === "event"
                            ? "#b7950b"
                            : "#8b7355",
                      fontFamily: FONT_MONO,
                      marginRight: 7,
                    }}
                  >
                    {card.type === "policy"
                      ? "POL"
                      : card.type === "event"
                        ? "OLY"
                        : "PAZAR"}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_TITLE,
                      fontSize: 13,
                      letterSpacing: 1,
                    }}
                  >
                    {card.name}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {card.type === "policy" && (
                    <button
                      onClick={() => onToggleUsed(ac.id)}
                      style={{
                        fontSize: 9,
                        fontFamily: FONT_MONO,
                        padding: "2px 7px",
                        borderRadius: 3,
                        background: ac.used ? "#0a2016" : "#1a1a1a",
                        color: ac.used ? "#2ecc71" : "#666",
                        border: `1px solid ${ac.used ? "#2ecc7130" : "#333"}`,
                      }}
                    >
                      {ac.used ? "KULLANILDI" : "KULLANILMADI"}
                    </button>
                  )}
                  <button
                    onClick={() => onMoneyLossClick && onMoneyLossClick(ac)}
                    title="Para Kaybetme"
                    style={{
                      fontSize: 11,
                      background: "none",
                      border: "none",
                      color: "#e67e22",
                      padding: "0 4px",
                      lineHeight: 1,
                      cursor: "pointer",
                      opacity: 0.7,
                    }}
                  >
                    💸
                  </button>
                  <button
                    onClick={() => onToggleCard(ac.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#444",
                      fontSize: 14,
                      padding: "0 4px",
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredCards.map((card) => {
          const isActive = activeCards.some((ac) => ac.id === card.id);
          const isPol = card.type === "policy";
          return (
            <div
              key={card.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                borderBottom: "1px solid #141414",
                background: isActive ? "#0a130a" : "transparent",
              }}
            >
              <div style={{ flex: 1, marginRight: 8 }}>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: FONT_MONO,
                    padding: "1px 5px",
                    borderRadius: 2,
                    background: isPol ? "#2471a318" : "#b7950b18",
                    color: isPol ? "#2471a3" : "#b7950b",
                    border: `1px solid ${isPol ? "#2471a330" : "#b7950b30"}`,
                    display: "inline-block",
                    marginBottom: 3,
                  }}
                >
                  {isPol ? "POLİTİKA" : "OLAY"}
                </span>
                <div
                  style={{
                    fontFamily: FONT_TITLE,
                    fontSize: 15,
                    letterSpacing: 1.5,
                    color: "#ddd6c8",
                  }}
                >
                  {card.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#555",
                    fontFamily: FONT_MONO,
                    marginTop: 2,
                  }}
                >
                  {card.effect}
                </div>
              </div>
              <button
                onClick={() => onToggleCard(card.id)}
                style={{
                  flexShrink: 0,
                  padding: "6px 10px",
                  fontFamily: FONT_TITLE,
                  fontSize: 12,
                  letterSpacing: 1,
                  background: isActive ? "#0a2016" : "#141414",
                  color: isActive ? "#2ecc71" : "#666",
                  border: isActive
                    ? "1px solid #2ecc7130"
                    : "1px solid #252525",
                  borderRadius: 3,
                }}
              >
                {isActive ? "✓ AKTİF" : "+ EKLE"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
