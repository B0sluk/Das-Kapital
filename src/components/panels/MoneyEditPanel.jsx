import { useState } from "react";
import { FONT_TITLE, FONT_MONO, RED, GOLD } from "../../constants";
import { PanelHeader } from "../shared/Common";

export default function MoneyEditPanel({ players, playerMulis, onClose, onAdjust }) {
  const [selected, setSelected] = useState(players[0] || "");
  const [amount, setAmount] = useState("");

  function handle(sign) {
    const val = parseInt(amount, 10);
    if (!val || val < 1) return;
    onAdjust(selected, sign * val);
    setAmount("");
  }

  const currentMuli = playerMulis[selected] || 0;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <PanelHeader title="PARA DÜZENLE" onClose={onClose} />

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {/* Player seç */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#555", fontFamily: FONT_MONO, letterSpacing: 1, marginBottom: 8 }}>
            OYUNCU SEÇ
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {players.map((p) => (
              <button
                key={p}
                onClick={() => setSelected(p)}
                style={{
                  padding: "8px 14px",
                  fontFamily: FONT_TITLE,
                  fontSize: 13,
                  letterSpacing: 1.5,
                  background: selected === p ? RED : "#141414",
                  color: selected === p ? "#fff" : "#888",
                  border: `1px solid ${selected === p ? RED : "#252525"}`,
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Mevcut bakiye */}
        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
            borderRadius: 6,
            padding: "14px 16px",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#555", letterSpacing: 1 }}>
            {selected} — BAKİYE
          </span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: GOLD }}>
            {currentMuli.toFixed(0)}M
          </span>
        </div>

        {/* Miktar giriş */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "#555", fontFamily: FONT_MONO, letterSpacing: 1, marginBottom: 8 }}>
            MİKTAR (M)
          </div>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="0"
            style={{
              width: "100%",
              padding: "12px 14px",
              fontFamily: FONT_MONO,
              fontSize: 22,
              background: "#0f0f0f",
              color: GOLD,
              border: "1px solid #2a2a2a",
              borderRadius: 6,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Hızlı miktar butonları */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 20 }}>
          {[1, 2, 5, 10, 20, 50].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              style={{
                padding: "8px 0",
                fontFamily: FONT_MONO,
                fontSize: 13,
                background: "#141414",
                color: "#aaa",
                border: "1px solid #272727",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {v}M
            </button>
          ))}
        </div>

        {/* Ekle / Çıkar */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => handle(-1)}
            style={{
              flex: 1,
              padding: "14px",
              fontFamily: FONT_TITLE,
              fontSize: 16,
              letterSpacing: 2,
              background: "#150808",
              color: "#e74c3c",
              border: "1px solid #e74c3c40",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            − ÇIKAR
          </button>
          <button
            onClick={() => handle(1)}
            style={{
              flex: 1,
              padding: "14px",
              fontFamily: FONT_TITLE,
              fontSize: 16,
              letterSpacing: 2,
              background: "#081508",
              color: "#2ecc71",
              border: "1px solid #2ecc7140",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            + EKLE
          </button>
        </div>
      </div>
    </div>
  );
}
