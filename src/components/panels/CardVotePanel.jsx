import { useState } from "react";
import { FONT_TITLE, FONT_MONO, RED } from "../../constants";
import { PanelHeader } from "../shared/Common";
import { getEffectDescription } from "../../utils/cardHelpers";

export default function CardVotePanel({
  card,
  players,
  onClose,
  onApprove,
  onReject,
}) {
  const [votes, setVotes] = useState({});

  const allVoted =
    Object.keys(votes).length > 0 &&
    Object.values(votes).every((v) => v !== null);
  const approvedCount = Object.values(votes).filter(
    (v) => v === "approved",
  ).length;
  const rejectedCount = Object.values(votes).filter(
    (v) => v === "rejected",
  ).length;

  const isMajorityApproved = allVoted && approvedCount > rejectedCount;
  const isRejected = allVoted && approvedCount <= rejectedCount;

  const handleInitializeVotes = () => {
    const initialVotes = Object.fromEntries(players.map((p) => [p, null]));
    setVotes(initialVotes);
  };

  const castVote = (player, approve) => {
    setVotes((v) => {
      const u = { ...v, [player]: approve ? "approved" : "rejected" };
      // Auto-approve others if SEN approves (for quick mock simulation)
      if (player === "SEN" && approve) {
        players.forEach((p) => {
          if (p !== "SEN") u[p] = "approved";
        });
      }
      return u;
    });
  };

  if (Object.keys(votes).length === 0) {
    return (
      <>
        <PanelHeader
          title={`${card.type === "policy" ? "POLİTİKA" : "OLAY"} OYLAMASI`}
          onClose={onClose}
        />
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid #1e1e1e",
              borderRadius: 6,
              padding: "16px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: card.type === "policy" ? "#2471a3" : "#b7950b",
                fontFamily: FONT_MONO,
                marginBottom: 8,
                letterSpacing: 2,
              }}
            >
              {card.type === "policy" ? "POLİTİKA KARTI" : "OLAY KARTI"}
            </div>
            <div
              style={{
                fontFamily: FONT_TITLE,
                fontSize: 20,
                letterSpacing: 2,
                marginBottom: 12,
                color: "#ddd6c8",
              }}
            >
              {card.name}
            </div>
            <div
              style={{
                background: "#080808",
                borderRadius: 4,
                padding: "10px 12px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#555",
                  fontFamily: FONT_MONO,
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                PİYASA ETKİSİ
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#aaa",
                  fontFamily: FONT_MONO,
                  fontWeight: 700,
                }}
              >
                {getEffectDescription(card.effect)}
              </div>
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#666",
                fontFamily: FONT_MONO,
                lineHeight: 1.6,
              }}
            >
              Bu {card.type === "policy" ? "politika" : "olay"} tüm oyuncuları
              etkileyecek. Onay için oyların çoğunluğu (eşitlikte red) geçerlidir.
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
            onClick={handleInitializeVotes}
            style={{
              flex: 1,
              padding: "10px",
              fontFamily: FONT_TITLE,
              fontSize: 16,
              letterSpacing: 2,
              background: RED,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            OYLAMAYA BAŞ LA
          </button>
        </div>
      </>
    );
  }

  // const anyRejected = Object.values(votes).some((v) => v === "rejected");

  return (
    <>
      <PanelHeader title={`OYLAMA: ${card.name}`} onClose={onClose} />
      <div
        style={{
          padding: "14px 16px",
          background: "#080808",
          borderBottom: "1px solid #181818",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#666",
            fontFamily: FONT_MONO,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          ONAY: {approvedCount} / RED: {rejectedCount}
        </div>
        <div
          style={{
            height: 2,
            background: "#1a1a1a",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#2ecc71",
              borderRadius: 2,
              width: `${(approvedCount / players.length) * 100}%`,
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        {players.map((p) => {
          const v = votes[p];
          const isSen = p === "SEN";
          return (
            <div
              key={p}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 14px",
                background: "#0f0f0f",
                border: `1px solid ${
                  v === "approved"
                    ? "#2ecc7130"
                    : v === "rejected"
                      ? "#e74c3c30"
                      : "#1e1e1e"
                }`,
                borderRadius: 4,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_TITLE,
                  fontSize: 16,
                  letterSpacing: 2,
                  color: isSen ? RED : "#ddd",
                }}
              >
                {p}
              </span>
              {v === null && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => castVote(p, false)}
                    style={{
                      padding: "6px 12px",
                      fontFamily: FONT_TITLE,
                      fontSize: 12,
                      letterSpacing: 1,
                      background: "#1a0808",
                      color: "#e74c3c",
                      border: "1px solid #e74c3c40",
                      borderRadius: 3,
                      cursor: "pointer",
                    }}
                  >
                    RED
                  </button>
                  <button
                    onClick={() => castVote(p, true)}
                    style={{
                      padding: "6px 12px",
                      fontFamily: FONT_TITLE,
                      fontSize: 12,
                      letterSpacing: 1,
                      background: "#0a2016",
                      color: "#2ecc71",
                      border: "1px solid #2ecc7140",
                      borderRadius: 3,
                      cursor: "pointer",
                    }}
                  >
                    ONAYLA
                  </button>
                </div>
              )}
              {v === "approved" && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#2ecc71",
                    fontFamily: FONT_MONO,
                  }}
                >
                  ✓ ONAYLADI
                </span>
              )}
              {v === "rejected" && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#e74c3c",
                    fontFamily: FONT_MONO,
                  }}
                >
                  ✕ REDDETTİ
                </span>
              )}
            </div>
          );
        })}

        {isRejected && (
          <div
            style={{
              marginTop: 16,
              background: "#150808",
              border: "1px solid #e74c3c40",
              borderRadius: 6,
              padding: "14px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: 12, color: "#e74c3c", fontFamily: FONT_MONO }}
            >
              Kart reddedildi.
            </div>
          </div>
        )}
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
          ← GERİ
        </button>
        <button
          onClick={() => (isMajorityApproved ? onApprove() : null)}
          disabled={!isMajorityApproved}
          style={{
            flex: 1,
            padding: "10px",
            fontFamily: FONT_TITLE,
            fontSize: 16,
            letterSpacing: 2,
            background: isMajorityApproved ? RED : "#181818",
            color: isMajorityApproved ? "#fff" : "#444",
            border: "none",
            borderRadius: 4,
            cursor: isMajorityApproved ? "pointer" : "default",
          }}
        >
          UYGULA
        </button>
      </div>
    </>
  );
}
