import { useState } from "react";
import { FONT_TITLE, FONT_MONO, RED, GOLD } from "../../constants";
import { PanelHeader, AdjBtn } from "../shared/Common";

export default function PriceEditPanel({
  res,
  cos,
  players,
  onClose,
  onProposePrices,
}) {
  const [editedRes, setEditedRes] = useState(
    Object.fromEntries(Object.entries(res).map(([id, d]) => [id, d.base])),
  );

  const [editedCos, setEditedCos] = useState(
    Object.fromEntries(Object.entries(cos).map(([id, d]) => [id, d.price])),
  );

  const [isVoting, setIsVoting] = useState(false);
  const [votes, setVotes] = useState({});

  function adjustResPrice(id, delta) {
    setEditedRes((p) => ({
      ...p,
      [id]: Math.max(1, Math.round(p[id] + delta)),
    }));
  }

  function adjustCosPrice(id, delta) {
    setEditedCos((p) => ({
      ...p,
      [id]: Math.max(1, Math.round(p[id] + delta)),
    }));
  }

  function startVote() {
    setVotes(Object.fromEntries(players.map((p) => [p, null])));
    setIsVoting(true);
  }

  function castVote(player, approve) {
    setVotes((v) => {
      const u = { ...v, [player]: approve ? "approved" : "rejected" };
      if (player === "SEN" && approve) {
        players.forEach((p) => {
          if (p !== "SEN") u[p] = "approved";
        });
      }
      return u;
    });
  }

  const allVoted =
    Object.keys(votes).length > 0 &&
    Object.values(votes).every((v) => v !== null);
  const allApproved =
    allVoted && Object.values(votes).every((v) => v === "approved");
  const anyRejected = Object.values(votes).some((v) => v === "rejected");
  const approvedCount = Object.values(votes).filter(
    (v) => v === "approved",
  ).length;

  function handleApply() {
    onProposePrices(editedRes, editedCos);
    onClose();
  }

  if (isVoting) {
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
            FİYAT DEĞİŞİKLİĞİ OYLAMASI
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
            Tüm oyuncuların onayı gerekli — {approvedCount}/{players.length}{" "}
            onay
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
          {/* Proposed prices summary */}
          <div
            style={{
              background: "#0d0d0d",
              border: "1px solid #1e1e1e",
              borderRadius: 6,
              padding: "12px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: GOLD,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              ÖNERİLEN YENİ FİYATLAR:
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#555",
                    fontFamily: FONT_MONO,
                    marginBottom: 4,
                  }}
                >
                  KAYNAKLAR
                </div>
                {Object.entries(editedRes).map(([id, val]) => {
                  const oldVal = res[id].base;
                  const diff = val - oldVal;
                  return (
                    <div
                      key={id}
                      style={{
                        fontSize: 10,
                        fontFamily: FONT_MONO,
                        color: "#aaa",
                        marginBottom: 4,
                      }}
                    >
                      {id.toUpperCase()}: {oldVal}M →{" "}
                      {val}M{" "}
                      {diff !== 0 && (
                        <span
                          style={{ color: diff > 0 ? "#2ecc71" : "#e74c3c" }}
                        >
                          ({diff > 0 ? "+" : ""}
                          {diff})
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#555",
                    fontFamily: FONT_MONO,
                    marginBottom: 4,
                  }}
                >
                  ŞİRKETLER
                </div>
                {Object.entries(editedCos).map(([id, val]) => {
                  const oldVal = cos[id].price;
                  const diff = val - oldVal;
                  return (
                    <div
                      key={id}
                      style={{
                        fontSize: 10,
                        fontFamily: FONT_MONO,
                        color: "#aaa",
                        marginBottom: 4,
                      }}
                    >
                      {id.toUpperCase()}: {oldVal}M →{" "}
                      {val}M{" "}
                      {diff !== 0 && (
                        <span
                          style={{ color: diff > 0 ? "#2ecc71" : "#e74c3c" }}
                        >
                          ({diff > 0 ? "+" : ""}
                          {diff})
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Player Votes */}
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
                      REDDET
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

          {anyRejected && (
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
                style={{
                  fontSize: 12,
                  color: "#e74c3c",
                  fontFamily: FONT_MONO,
                }}
              >
                Fiyat değişikliği reddedildi.
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
            onClick={() => setIsVoting(false)}
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
            ← DÜZENLE
          </button>
          <button
            onClick={handleApply}
            disabled={!allApproved}
            style={{
              flex: 1,
              padding: "10px",
              fontFamily: FONT_TITLE,
              fontSize: 16,
              letterSpacing: 2,
              background: allApproved ? RED : "#181818",
              color: allApproved ? "#fff" : "#444",
              border: "none",
              borderRadius: 4,
              cursor: allApproved ? "pointer" : "default",
            }}
          >
            YENİ FİYATLARI UYGULA
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PanelHeader title="FİYAT DÜZENLEME" onClose={onClose} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
        {/* Resources Prices */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: GOLD,
              letterSpacing: 2,
              marginBottom: 12,
              borderBottom: "1px solid #222",
              paddingBottom: 6,
            }}
          >
            KAYNAK FİYATLARI
          </div>
          {Object.entries(editedRes).map(([id, val]) => (
            <div
              key={id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_TITLE,
                  fontSize: 16,
                  letterSpacing: 1.5,
                }}
              >
                {id.toUpperCase()}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{ fontSize: 11, color: "#555", fontFamily: FONT_MONO }}
                >
                  Önceki: {res[id].base}M
                </span>
                <AdjBtn onClick={() => adjustResPrice(id, -1)}>−</AdjBtn>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 18,
                    fontWeight: 700,
                    minWidth: 50,
                    textAlign: "center",
                    color: val !== res[id].base ? GOLD : "#fff",
                  }}
                >
                  {val}M
                </span>
                <AdjBtn onClick={() => adjustResPrice(id, 1)}>+</AdjBtn>
              </div>
            </div>
          ))}
        </div>

        {/* Company Share Prices */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: GOLD,
              letterSpacing: 2,
              marginBottom: 12,
              borderBottom: "1px solid #222",
              paddingBottom: 6,
            }}
          >
            ŞİRKET HİSSE FİYATLARI
          </div>
          {Object.entries(editedCos).map(([id, val]) => (
            <div
              key={id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_TITLE,
                  fontSize: 16,
                  letterSpacing: 1.5,
                }}
              >
                {id.toUpperCase()}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{ fontSize: 11, color: "#555", fontFamily: FONT_MONO }}
                >
                  Önceki: {cos[id].price}M
                </span>
                <AdjBtn onClick={() => adjustCosPrice(id, -1)}>−</AdjBtn>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 18,
                    fontWeight: 700,
                    minWidth: 50,
                    textAlign: "center",
                    color: val !== cos[id].price ? GOLD : "#fff",
                  }}
                >
                  {val}M
                </span>
                <AdjBtn onClick={() => adjustCosPrice(id, 1)}>+</AdjBtn>
              </div>
            </div>
          ))}
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
            cursor: "pointer",
          }}
        >
          İPTAL
        </button>
        <button
          onClick={startVote}
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
          OYLAMAYA SUN
        </button>
      </div>
    </>
  );
}
