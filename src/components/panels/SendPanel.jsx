import { FONT_TITLE, FONT_MONO, RED, RESOURCES } from "../../constants";
import { AdjBtn } from "../shared/Common";

export default function SendPanel({
  sendTo,
  basket,
  onAdjustBasket,
  onExecuteSend,
  onBack,
}) {
  const hasBasket = Object.values(basket).some((v) => v > 0);

  return (
    <>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #181818",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontSize: 20,
            letterSpacing: 3,
            color: RED,
          }}
        >
          → {sendTo}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#666",
            fontFamily: FONT_MONO,
            letterSpacing: 1,
            marginTop: 2,
          }}
        >
          ⚠ GERİ ALINAMAZ — SERMAYE AKIŞI
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {RESOURCES.map((r) => {
          const cur = basket[r.id] || 0;
          return (
            <div
              key={r.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "11px 16px",
                borderBottom: "1px solid #141414",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: FONT_TITLE,
                    fontSize: 16,
                    letterSpacing: 1.5,
                  }}
                >
                  {r.name}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AdjBtn onClick={() => onAdjustBasket(r.id, -1)}>−</AdjBtn>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 22,
                    fontWeight: 700,
                    minWidth: 26,
                    textAlign: "center",
                    color: cur > 0 ? "#e8b84b" : "#333",
                  }}
                >
                  {cur}
                </span>
                <AdjBtn onClick={() => onAdjustBasket(r.id, +1)}>+</AdjBtn>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          gap: 8,
          flexShrink: 0,
          borderTop: "1px solid #181818",
          background: "#0a0a0a",
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "10px 14px",
            fontFamily: FONT_TITLE,
            fontSize: 13,
            letterSpacing: 1,
            background: "#141414",
            color: "#666",
            border: "1px solid #272727",
            borderRadius: 4,
          }}
        >
          ← GERİ
        </button>
        <button
          onClick={onExecuteSend}
          style={{
            flex: 1,
            padding: "10px",
            fontFamily: FONT_TITLE,
            fontSize: 17,
            letterSpacing: 3,
            background: hasBasket ? RED : "#181818",
            color: hasBasket ? "#fff" : "#444",
            border: "none",
            borderRadius: 4,
          }}
        >
          GÖNDER
        </button>
      </div>
    </>
  );
}
