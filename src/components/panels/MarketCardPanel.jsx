import { useState } from "react";
import { FONT_TITLE, FONT_MONO, RED, GOLD } from "../../constants";
import { PanelHeader, AdjBtn } from "../shared/Common";

export default function MarketCardPanel({
  playerMuli,
  onClose,
  onBuyCard,
}) {
  const [cardName, setCardName] = useState("");
  const [costAmount, setCostAmount] = useState(1.0);

  function handleBuy() {
    if (!cardName.trim()) {
      alert("Kart adı girin!");
      return;
    }

    if (costAmount <= 0 || costAmount > playerMuli) {
      alert("Geçersiz tutar!");
      return;
    }

    onBuyCard(cardName, costAmount);
    setCardName("");
    setCostAmount(1.0);
    onClose();
  }

  function adjustCost(delta) {
    const newCost = +(costAmount + delta).toFixed(2);
    if (newCost > 0 && newCost <= playerMuli) {
      setCostAmount(newCost);
    }
  }

  return (
    <>
      <PanelHeader title="PAZAR KARTI SATINI AL" onClose={onClose} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              color: "#666",
              fontFamily: FONT_MONO,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            KART ADI
          </div>
          <input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuy()}
            placeholder="Kart adını girin..."
            maxLength={50}
            style={{
              width: "100%",
              background: "#111",
              border: "1px solid #333",
              borderRadius: 4,
              padding: "10px 12px",
              color: "#fff",
              fontFamily: FONT_TITLE,
              fontSize: 14,
              letterSpacing: 1.5,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              color: "#666",
              fontFamily: FONT_MONO,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            KART MALIYETI (M)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AdjBtn onClick={() => adjustCost(-0.5)}>−</AdjBtn>
            <input
              type="number"
              value={costAmount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0 && val <= playerMuli) {
                  setCostAmount(+(val).toFixed(2));
                }
              }}
              step="0.5"
              min="0.5"
              max={playerMuli}
              style={{
                flex: 1,
                background: "#111",
                border: "1px solid #333",
                borderRadius: 4,
                padding: "10px 12px",
                color: GOLD,
                fontFamily: FONT_MONO,
                fontSize: 16,
                fontWeight: 700,
                outline: "none",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            />
            <AdjBtn onClick={() => adjustCost(0.5)}>+</AdjBtn>
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#555",
              fontFamily: FONT_MONO,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Mevcut Bakiye: <span style={{ color: GOLD }}>{playerMuli.toFixed(2)}M</span>
            {" → "}
            <span style={{ color: costAmount > playerMuli ? "#e74c3c" : "#2ecc71" }}>
              {(playerMuli - costAmount).toFixed(2)}M
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            borderRadius: 6,
            padding: "12px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#555",
              fontFamily: FONT_MONO,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            ÖZET
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#777" }}>Kart Adı:</span>
            <span style={{ fontSize: 11, color: "#aaa" }}>{cardName || "—"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#777" }}>Maliyeti:</span>
            <span style={{ fontSize: 11, color: "#aaa" }}>
              {cardName ? `−${costAmount.toFixed(2)}M` : "—"}
            </span>
          </div>
        </div>
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
          onClick={onClose}
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
          ← İPTAL
        </button>
        <button
          onClick={handleBuy}
          disabled={!cardName.trim() || costAmount <= 0 || costAmount > playerMuli}
          style={{
            flex: 1,
            padding: "10px",
            fontFamily: FONT_TITLE,
            fontSize: 16,
            letterSpacing: 2,
            background:
              cardName.trim() && costAmount > 0 && costAmount <= playerMuli
                ? RED
                : "#181818",
            color:
              cardName.trim() && costAmount > 0 && costAmount <= playerMuli
                ? "#fff"
                : "#444",
            border: "none",
            borderRadius: 4,
            cursor:
              cardName.trim() && costAmount > 0 && costAmount <= playerMuli
                ? "pointer"
                : "default",
          }}
        >
          SATIN AL
        </button>
      </div>
    </>
  );
}
