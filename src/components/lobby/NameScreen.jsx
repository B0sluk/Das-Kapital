import { useState, useEffect, useRef } from "react";
import { FONT_TITLE, FONT_MONO, RED } from "../../constants";

export default function NameScreen({ onJoin }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const valid = name.trim().length >= 2;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a0a0a",
        padding: "32px 24px",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div style={{ width: "100%", maxWidth: 320 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontFamily: FONT_TITLE,
              fontSize: 42,
              letterSpacing: 6,
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
              color: "#444",
              letterSpacing: 3,
              marginTop: 6,
            }}
          >
            COMPANION APP
          </div>
          <div
            style={{
              width: 40,
              height: 2,
              background: RED,
              margin: "12px auto 0",
            }}
          />
        </div>

        {/* Form */}
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: "#555",
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          ADINI GİR
        </div>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && valid && onJoin(name.trim().toUpperCase())
          }
          placeholder="örn. ALEKSANDER"
          maxLength={14}
          style={{
            width: "100%",
            background: "#111",
            border: `1px solid ${name.length > 0 ? "#444" : "#222"}`,
            borderRadius: 4,
            padding: "14px 16px",
            color: "#fff",
            fontSize: 16,
            fontFamily: FONT_TITLE,
            letterSpacing: 2,
            marginBottom: 12,
            transition: "border-color 0.2s",
            outline: "none",
          }}
        />
        <button
          onClick={() => valid && onJoin(name.trim().toUpperCase())}
          style={{
            width: "100%",
            padding: "14px",
            fontFamily: FONT_TITLE,
            fontSize: 20,
            letterSpacing: 4,
            background: valid ? RED : "#1a1a1a",
            color: valid ? "#fff" : "#444",
            border: "none",
            borderRadius: 4,
            transition: "background 0.2s",
          }}
        >
          KATIL
        </button>

        <div
          style={{
            marginTop: 32,
            textAlign: "center",
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: "#333",
            letterSpacing: 1,
            lineHeight: 1.8,
          }}
        >
          QR kodu okutarak veya
          <br />
          link ile katılabilirsin
        </div>
      </div>
    </div>
  );
}
