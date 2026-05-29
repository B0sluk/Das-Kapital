import { useState } from "react";
import { FONT_TITLE, FONT_MONO, RED } from "../../constants";
import QRCode from "../shared/QRCode";
import PlayerRow from "./PlayerRow";

export default function LobbyScreen({
  myName,
  sessionCode,
  isHost,
  players,
  onAddPlayer,
  onRemovePlayer,
  onBegin,
}) {
  const [newPlayerName, setNewPlayerName] = useState("");

  const lobbyUrl = `${window.location.origin}${window.location.pathname}?code=${sessionCode}`;

  function handleAdd() {
    if (newPlayerName.trim().length >= 2) {
      onAddPlayer(newPlayerName.trim().toUpperCase());
      setNewPlayerName("");
    }
  }

  const canBegin = players.length >= 2;

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
          LOBİ —{" "}
          {isHost ? (
            <>HOST: <span style={{ color: RED }}>{myName}</span></>
          ) : (
            <>OYUNCU: <span style={{ color: RED }}>{myName}</span></>
          )}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
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
          <QRCode size={110} url={lobbyUrl} />
          <div style={{ flex: 1, minWidth: 0 }}>
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
              {sessionCode}
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
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                color: "#666",
                marginTop: 6,
                wordBreak: "break-all",
                lineHeight: 1.4,
                userSelect: "all",
              }}
            >
              {lobbyUrl}
            </div>
          </div>
        </div>

        {/* Add Player (Host only) */}
        {isHost && (
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
                fontFamily: FONT_MONO,
                fontSize: 9,
                color: "#555",
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              YENİ OYUNCU EKLE
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="OYUNCU ADI (örn. YUKI)"
                maxLength={14}
                style={{
                  flex: 1,
                  background: "#111",
                  border: "1px solid #333",
                  borderRadius: 4,
                  padding: "8px 12px",
                  color: "#fff",
                  fontFamily: FONT_TITLE,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  outline: "none",
                }}
              />
              <button
                onClick={handleAdd}
                style={{
                  padding: "8px 16px",
                  fontFamily: FONT_TITLE,
                  fontSize: 14,
                  letterSpacing: 1,
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                EKLE
              </button>
            </div>
          </div>
        )}

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
            OYUNCULAR — {players.length}/6 BAĞLI
          </div>

          {players.map((p, i) => {
            const isMe = p === "SEN" || p === myName;
            return (
              <div
                key={p}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "#0f0f0f",
                  border: "1px solid #1e1e1e",
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: i === 0 ? RED : "#2ecc71",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_TITLE,
                      fontSize: 16,
                      letterSpacing: 2,
                      color: isMe ? RED : "#fff",
                    }}
                  >
                    {p} {isMe && "(SEN)"} {i === 0 && "👑"}
                  </span>
                </div>
                {isHost && i > 0 && (
                  <button
                    onClick={() => onRemovePlayer(p)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#555",
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: FONT_MONO,
                    }}
                  >
                    ✕ KALDIR
                  </button>
                )}
              </div>
            );
          })}

          {Array.from({ length: Math.max(0, 5 - players.length) }).map((_, i) => (
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
          ))}
        </div>

        {/* Status */}
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: "#333",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          {isHost
            ? "Host olarak lobiyi yönetiyorsun · diğerlerini ekle veya QR/kod ile davet et"
            : `Lobiye bağlandın · host oyunu başlatana dek bekle`}
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
          {isHost
            ? "En az 2 oyuncu olduğunda oyunu başlatabilirsin"
            : "Sadece host oyunu başlatabilir"}
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
            cursor: canBegin ? "pointer" : "default",
            transition: "background 0.3s",
          }}
        >
          {canBegin ? "OYUNU BAŞLAT" : "BEKLENİYOR..."}
        </button>
      </div>
    </div>
  );
}
