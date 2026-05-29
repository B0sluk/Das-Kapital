import { useState, useEffect } from "react";
import { FONT_TITLE, FONT_MONO, RED } from "../../constants";

export default function PlayerRow({ name, isMe, isHost, index }) {
  const [visible, setVisible] = useState(isMe);

  useEffect(() => {
    if (!isMe) {
      const t = setTimeout(() => setVisible(true), 60);
      return () => clearTimeout(t);
    }
  }, []);

  const initials = name.slice(0, 2);
  const hue = [0, 210, 45, 270, 155][index % 5];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        marginBottom: 6,
        borderRadius: 4,
        background: "#0f0f0f",
        border: `1px solid ${isMe ? "#cc111130" : "#1a1a1a"}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.35s, transform 0.35s",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: `hsl(${hue},40%,18%)`,
          border: `1px solid hsl(${hue},40%,30%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_TITLE,
          fontSize: 13,
          letterSpacing: 1,
          color: `hsl(${hue},60%,65%)`,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <span
        style={{
          fontFamily: FONT_TITLE,
          fontSize: 16,
          letterSpacing: 2,
          color: isMe ? RED : "#ddd6c8",
          flex: 1,
        }}
      >
        {name}
      </span>
      {isHost && (
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: RED,
            border: `1px solid ${RED}40`,
            padding: "2px 6px",
            borderRadius: 3,
            letterSpacing: 1,
          }}
        >
          HOST
        </span>
      )}
      {isMe && !isHost && (
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: "#555",
            letterSpacing: 1,
          }}
        >
          sen
        </span>
      )}
    </div>
  );
}
