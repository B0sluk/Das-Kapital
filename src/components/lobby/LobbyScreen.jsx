import { useState, useEffect } from "react";
import { FONT_TITLE, FONT_MONO, RED } from "../../constants";
import QRCode from "../shared/QRCode";
import PlayerRow from "./PlayerRow";

export default function LobbyScreen({ myName, onBegin }) {
  const [joined, setJoined] = useState([{ name: myName, isMe: true }]);
  const [allReady, setAllReady] = useState(false);
  const SESSION_CODE = "KAP-4821";

  useEffect(() => {
    const delays = [1400, 2800, 4000, 5600];
    const names = ["ALEKSANDER", "YUKI", "OMAR", "FATIMA"];
    const timers = delays.map((d, i) =>
      setTimeout(() => {
        setJoined((p) => [...p, { name: names[i], isMe: false }]);
        if (i === names.length - 1) setAllReady(true);
      }, d),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const canBegin = joined.length >= 2;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
        maxWidth: 480,
        margin: "0 auto",
        borderLeft: "1px solid #181818",
        borderRight: "1px solid #181818",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #181818",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontSize: 22,
            letterSpacing: 4,
            color: RED,
            lineHeight: 1,
          }}
        >
          DAS KAPITAL
        </div>
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: "#555",
            letterSpacing: 2,
            marginTop: 3,
          }}
        >
          LOBİ — HOST: <span style={{ color: RED }}>{myName}</span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Session code + QR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: "#0f0f0f",
            border: "1px solid #1e1e1e",
            borderRadius: 8,
            padding: "18px 20px",
          }}
        >
          <QRCode size={110} />
          <div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                color: "#555",
                letterSpacing: 2,
                marginBottom: 6,
              }}
            >
              OTURUM KODU
            </div>
            <div
              style={{
                fontFamily: FONT_TITLE,
                fontSize: 28,
                letterSpacing: 4,
                color: "#fff",
              }}
            >
              {SESSION_CODE}
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: "#444",
                marginTop: 8,
                lineHeight: 1.6,
              }}
            >
              QR'ı okut ya da
              <br />
              kodu paylaş
            </div>
          </div>
        </div>

        {/* Player list */}
        <div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 9,
              color: "#444",
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            OYUNCULAR — {joined.length}/6 BAĞLI
          </div>

          {joined.map((p, i) => (
            <PlayerRow
              key={p.name}
              name={p.name}
              isMe={p.isMe}
              isHost={i === 0}
              index={i}
            />
          ))}

          {Array.from({ length: Math.max(0, 4 - joined.length + 1) }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  marginBottom: 6,
                  borderRadius: 4,
                  border: "1px dashed #1e1e1e",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#111",
                    border: "1px dashed #2a2a2a",
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: "#2a2a2a",
                  }}
                >
                  Bekleniyor...
                </span>
              </div>
            ),
          )}
        </div>

        {/* Status line */}
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: "#444",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          {allReady
            ? "✓ Tüm oyuncular bağlandı"
            : `${joined.length} oyuncu bağlı · diğerleri bekleniyor`}
        </div>
      </div>

      {/* Begin button */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid #181818",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: "#333",
            letterSpacing: 1,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Sadece host başlatabilir · en az 2 oyuncu gerekli
        </div>
        <button
          onClick={canBegin ? onBegin : undefined}
          style={{
            width: "100%",
            padding: "14px",
            fontFamily: FONT_TITLE,
            fontSize: 20,
            letterSpacing: 4,
            background: canBegin ? RED : "#161616",
            color: canBegin ? "#fff" : "#333",
            border: "none",
            borderRadius: 4,
            transition: "background 0.3s",
          }}
        >
          {canBegin ? "OYUNU BAŞLAT" : "BEKLENİYOR..."}
        </button>
      </div>
    </div>
  );
}
