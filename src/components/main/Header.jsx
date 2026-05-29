import { FONT_TITLE, FONT_MONO, RED, GOLD } from "../../constants";

export default function Header({
  myName,
  muli,
  unread,
  quarter,
  firstPlayer,
  onNotificationsClick,
}) {
  return (
    <div
      style={{
        padding: "10px 16px",
        borderBottom: "1px solid #181818",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontSize: 26,
            letterSpacing: 5,
            color: RED,
            lineHeight: 1,
          }}
        >
          DAS KAPITAL
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#555",
            fontFamily: FONT_MONO,
            letterSpacing: 2,
            marginTop: 2,
          }}
        >
          FIRST PLAYER: <span style={{ color: RED }}>{firstPlayer}</span>
          <span
            style={{
              marginLeft: 10,
              color: "#444",
              border: "1px solid #2a2a2a",
              padding: "1px 7px",
              borderRadius: 2,
            }}
          >
            Q{quarter}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 9,
              color: "#555",
              fontFamily: FONT_MONO,
              letterSpacing: 1,
            }}
          >
            MULİ
          </div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 22,
              fontWeight: 700,
              color: GOLD,
            }}
          >
            {muli.toFixed(2)}
          </div>
        </div>
        <button
          onClick={onNotificationsClick}
          style={{
            background: "none",
            border: "1px solid #222",
            borderRadius: 6,
            padding: "7px 11px",
            position: "relative",
            color: "#888",
            fontSize: 17,
            lineHeight: 1,
          }}
        >
          🔔
          {unread > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: RED,
                color: "#fff",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_MONO,
              }}
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
