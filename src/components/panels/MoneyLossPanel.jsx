import { useState } from "react";
import { FONT_TITLE, FONT_MONO, RED, GOLD } from "../../constants";
import { PanelHeader, AdjBtn } from "../shared/Common";

export default function MoneyLossPanel({
  playerMuli,
  cardName,
  onClose,
  onDeductMoney,
}) {
  const [lossAmount, setLossAmount] = useState(1.0);

  function handleDeduct() {
    if (lossAmount <= 0 || lossAmount > playerMuli) {
      alert("Geçersiz tutar!");
      return;
    }

    onDeductMoney(lossAmount);
    setLossAmount(1.0);
    onClose();
  }

  function adjustAmount(delta) {
    const newAmount = +(lossAmount + delta).toFixed(2);
    if (newAmount > 0 && newAmount <= playerMuli) {
      setLossAmount(newAmount);
    }
  }

  return (
    <>
      <PanelHeader title={`PARA KAYBETME: ${cardName}`} onClose={onClose} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <div
          style={{
            background: "#150808",
            border: "1px solid #3a1508",
            borderRadius: 6,
            padding: "14px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#e67e22",
              fontFamily: FONT_MONO,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            UYARI
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#ccc",
              lineHeight: 1.6,
            }}
          >
            Bu kart nedeniyle kaybedilecek parayla tutarını ayarla ve onayla.
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              color: "#666",
              fontFamily: FONT_MONO,
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            KAYIP TUTARI (M)
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <AdjBtn onClick={() => adjustAmount(-0.5)}>−</AdjBtn>
            <input
              type="number"
              value={lossAmount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0 && val <= playerMuli) {
                  setLossAmount(+val.toFixed(2));
                }
              }}
              step="0.5"
              min="0.5"
              max={playerMuli}
              style={{
                flex: 1,
                background: "#111",
                border: "1px solid #e67e2240",
                borderRadius: 4,
                padding: "12px",
                color: "#e67e22",
                fontFamily: FONT_MONO,
                fontSize: 18,
                fontWeight: 700,
                outline: "none",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            />
            <AdjBtn onClick={() => adjustAmount(0.5)}>+</AdjBtn>
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#555",
              fontFamily: FONT_MONO,
              textAlign: "center",
            }}
          >
            Mevcut:{" "}
            <span style={{ color: GOLD }}>{playerMuli.toFixed(2)}M</span>
            {" → "}
            <span
              style={{ color: lossAmount > playerMuli ? "#e74c3c" : "#2ecc71" }}
            >
              {(playerMuli - lossAmount).toFixed(2)}M
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            borderRadius: 6,
            padding: "12px",
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
            İŞLEM ÖZETİ
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 11, color: "#777" }}>Kart:</span>
            <span style={{ fontSize: 11, color: "#aaa" }}>{cardName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#777" }}>Kaybedilecek:</span>
            <span style={{ fontSize: 11, color: "#e67e22", fontWeight: 700 }}>
              −{lossAmount.toFixed(2)}M
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
          onClick={handleDeduct}
          disabled={lossAmount <= 0 || lossAmount > playerMuli}
          style={{
            flex: 1,
            padding: "10px",
            fontFamily: FONT_TITLE,
            fontSize: 16,
            letterSpacing: 2,
            background:
              lossAmount > 0 && lossAmount <= playerMuli
                ? "#c0392b"
                : "#181818",
            color: lossAmount > 0 && lossAmount <= playerMuli ? "#fff" : "#444",
            border: "none",
            borderRadius: 4,
            cursor:
              lossAmount > 0 && lossAmount <= playerMuli
                ? "pointer"
                : "default",
          }}
        >
          ONAYLA
        </button>
      </div>
    </>
  );
}
