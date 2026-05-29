import { FONT_TITLE, FONT_MONO, RED, GOLD, RESOURCES } from "../../constants";

export default function ResourcesTab({
  res,
  muli,
  onBuyRes,
  onSellRes,
  onEarnRes,
  onSpendRes,
}) {
  return (
    <>
      {RESOURCES.map((r) => {
        const d = res[r.id];
        const bp = +(d.base * 1.5).toFixed(2);
        return (
          <div
            key={r.id}
            style={{ padding: "11px 16px", borderBottom: "1px solid #141414" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 7,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONT_TITLE,
                    fontSize: 17,
                    letterSpacing: 2,
                    color: "#ddd6c8",
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: "#666",
                    marginTop: 1,
                  }}
                >
                  AL <span style={{ color: GOLD }}>{bp}M</span>
                  {"  "}SAT{" "}
                  <span style={{ color: GOLD }}>{d.base.toFixed(1)}M</span>
                  {d.buys % 3 !== 0 && d.buys > 0 && (
                    <span style={{ color: "#e74c3c", marginLeft: 8 }}>
                      ↑{d.buys % 3}/3
                    </span>
                  )}
                  {d.sells % 3 !== 0 && d.sells > 0 && (
                    <span style={{ color: "#3498db", marginLeft: 8 }}>
                      ↓{d.sells % 3}/3
                    </span>
                  )}
                </div>
              </div>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                {d.amount}
              </span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[
                {
                  label: "AL",
                  fn: () => onBuyRes(r.id),
                  bg: RED,
                  cl: "#fff",
                  br: "none",
                },
                {
                  label: "SAT",
                  fn: () => onSellRes(r.id),
                  bg: "#141414",
                  cl: d.amount < 1 ? "#2a2a2a" : "#999",
                  br: "1px solid #272727",
                },
                {
                  label: "+EARN",
                  fn: () => onEarnRes(r.id),
                  bg: "#091a10",
                  cl: "#2ecc71",
                  br: "1px solid #2ecc7120",
                },
                {
                  label: "−SPEND",
                  fn: () => onSpendRes(r.id),
                  bg: "#180c07",
                  cl: d.amount < 1 ? "#2a1508" : "#e67e22",
                  br: "1px solid #e67e2220",
                },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.fn}
                  style={{
                    flex: 1,
                    padding: "7px 0",
                    fontSize: 11,
                    fontFamily: FONT_TITLE,
                    letterSpacing: 1,
                    background: btn.bg,
                    color: btn.cl,
                    border: btn.br,
                    borderRadius: 3,
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
