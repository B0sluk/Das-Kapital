import { FONT_TITLE, FONT_MONO, RED } from "../../constants";
import { PanelHeader } from "../shared/Common";

export default function NotificationsPanel({ notifs, onClose }) {
  return (
    <>
      <PanelHeader title="BİLDİRİMLER" onClose={onClose} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {notifs.map((n) => (
          <div
            key={n.id}
            style={{ padding: "10px 16px", borderBottom: "1px solid #141414" }}
          >
            <div style={{ fontSize: 12, color: "#bbb", fontFamily: FONT_MONO }}>
              {n.msg}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#444",
                fontFamily: FONT_MONO,
                marginTop: 3,
              }}
            >
              {n.t}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
