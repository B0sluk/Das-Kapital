import { FONT_TITLE, FONT_MONO, RED } from "../../constants";

export default function QuarterVotePanel({
  quarter,
  votes,
  players = [],
  nextFP,
  onCastVote,
  onSetNextFP,
  onFinalizeQuarter,
  onCancel,
}) {
  const voteValues = players.map((player) => votes[player] || "pending");
  const allVoted =
    players.length > 0 &&
    voteValues.every((v) => v === "approved" || v === "rejected");
  const approvedCount = voteValues.filter(
    (v) => v === "approved",
  ).length;
  const rejectedCount = voteValues.filter(
    (v) => v === "rejected",
  ).length;

  const isMajorityApproved = allVoted && approvedCount > rejectedCount;
  const isRejected = allVoted && approvedCount <= rejectedCount;

  return (
    <>
      <div
        style={{
          padding: "14px 16px",
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
          Q{quarter} → Q{quarter + 1}
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
          Çoğunluk onayı gerekli — {approvedCount} Onay / {rejectedCount} Red
        </div>
        <div
          style={{
            marginTop: 8,
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
          const v = votes[p] || "pending";
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
                border: `1px solid ${v === "approved" ? "#2ecc7130" : v === "rejected" ? "#e74c3c30" : "#1e1e1e"}`,
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
              {v === "pending" && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => onCastVote(p, false)}
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
                    REDDET
                  </button>
                  <button
                    onClick={() => onCastVote(p, true)}
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
        {isMajorityApproved && (
          <div
            style={{
              marginTop: 16,
              background: "#0a150a",
              border: "1px solid #2ecc7130",
              borderRadius: 6,
              padding: "14px",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#2ecc71",
                fontFamily: FONT_MONO,
                letterSpacing: 2,
                marginBottom: 12,
              }}
            >
              ✓ ÇOĞUNLUK ONAYLADI — SONRAKİ FIRST PLAYER SEÇ
            </div>
            {players.map((p) => (
              <button
                key={p}
                onClick={() => onSetNextFP(p)}
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: 6,
                  padding: "10px 14px",
                  textAlign: "left",
                  fontFamily: FONT_TITLE,
                  fontSize: 15,
                  letterSpacing: 2,
                  background: nextFP === p ? RED : "#141414",
                  color: nextFP === p ? "#fff" : "#888",
                  border: nextFP === p ? "none" : "1px solid #252525",
                  borderRadius: 3,
                  cursor: "pointer",
                }}
              >
                {p}
                {nextFP === p && " ←"}
              </button>
            ))}
          </div>
        )}
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
              Quarter geçişi reddedildi. Oyuna devam edin.
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
          onClick={onCancel}
          style={{
            padding: "10px 14px",
            fontFamily: FONT_TITLE,
            fontSize: 13,
            letterSpacing: 1,
            background: "#141414",
            color: "#666",
            border: "1px solid #272727",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          İPTAL
        </button>
        <button
          onClick={onFinalizeQuarter}
          disabled={!isMajorityApproved || !nextFP}
          style={{
            flex: 1,
            padding: "10px",
            fontFamily: FONT_TITLE,
            fontSize: 16,
            letterSpacing: 2,
            background: isMajorityApproved && nextFP ? RED : "#181818",
            color: isMajorityApproved && nextFP ? "#fff" : "#444",
            border: "none",
            borderRadius: 4,
            cursor: isMajorityApproved && nextFP ? "pointer" : "default",
          }}
        >
          Q{quarter + 1} BAŞLAT
        </button>
      </div>
    </>
  );
}
