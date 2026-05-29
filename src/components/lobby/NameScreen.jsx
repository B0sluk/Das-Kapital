import { useState, useEffect, useRef } from "react";
import { FONT_TITLE, FONT_MONO, RED } from "../../constants";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "KAP-";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function NameScreen({ onJoin }) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState("create"); // "create" | "join"
  const [joinCode, setJoinCode] = useState("");
  const [generatedCode] = useState(generateCode);
  const nameRef = useRef(null);
  const codeRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (mode === "join") codeRef.current?.focus();
    else nameRef.current?.focus();
  }, [mode]);

  const validName = name.trim().length >= 2;
  const validCode = joinCode.trim().length >= 4;
  const canSubmit = validName && (mode === "create" || validCode);

  function handleJoin() {
    if (!canSubmit) return;
    const n = name.trim().toUpperCase();
    if (mode === "create") {
      onJoin(n, generatedCode, true);
    } else {
      onJoin(n, joinCode.trim().toUpperCase(), false);
    }
  }

  const tabStyle = (active) => ({
    flex: 1,
    padding: "10px",
    fontFamily: FONT_TITLE,
    fontSize: 13,
    letterSpacing: 2,
    background: active ? "#1a0505" : "transparent",
    color: active ? RED : "#444",
    border: "none",
    borderBottom: `2px solid ${active ? RED : "transparent"}`,
    cursor: "pointer",
    transition: "all 0.2s",
  });

  const inputStyle = (hasValue) => ({
    width: "100%",
    background: "#111",
    border: `1px solid ${hasValue ? "#444" : "#222"}`,
    borderRadius: 4,
    padding: "13px 16px",
    color: "#fff",
    fontSize: 15,
    fontFamily: FONT_TITLE,
    letterSpacing: 2,
    marginBottom: 10,
    transition: "border-color 0.2s",
    outline: "none",
  });

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
        <div style={{ textAlign: "center", marginBottom: 40 }}>
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
              margin: "10px auto 0",
            }}
          />
        </div>

        {/* Mode Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #1e1e1e",
            marginBottom: 20,
          }}
        >
          <button style={tabStyle(mode === "create")} onClick={() => setMode("create")}>
            YENİ LOBİ
          </button>
          <button style={tabStyle(mode === "join")} onClick={() => setMode("join")}>
            KODA GİR
          </button>
        </div>

        {/* Name */}
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: "#555",
            letterSpacing: 2,
            marginBottom: 6,
          }}
        >
          OYUNCU ADI
        </div>
        <input
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          placeholder="örn. ALEKSANDER"
          maxLength={14}
          style={inputStyle(name.length > 0)}
        />

        {/* Session Code input (join mode) */}
        {mode === "join" && (
          <>
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
            <input
              ref={codeRef}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="örn. KAP-4821"
              maxLength={8}
              style={inputStyle(joinCode.length > 0)}
            />
          </>
        )}

        {/* Generated code preview (create mode) */}
        {mode === "create" && (
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              color: "#333",
              letterSpacing: 1,
              marginBottom: 12,
              padding: "8px 12px",
              background: "#0d0d0d",
              borderRadius: 4,
              border: "1px solid #1a1a1a",
            }}
          >
            Lobi kodu:{" "}
            <span style={{ color: "#666", letterSpacing: 2 }}>{generatedCode}</span>
          </div>
        )}

        <button
          onClick={handleJoin}
          style={{
            width: "100%",
            padding: "14px",
            fontFamily: FONT_TITLE,
            fontSize: 20,
            letterSpacing: 4,
            background: canSubmit ? RED : "#1a1a1a",
            color: canSubmit ? "#fff" : "#444",
            border: "none",
            borderRadius: 4,
            transition: "background 0.2s",
            cursor: canSubmit ? "pointer" : "default",
          }}
        >
          {mode === "create" ? "LOBİ OLUŞTUR" : "KATIL"}
        </button>

        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: "#2a2a2a",
            letterSpacing: 1,
            lineHeight: 1.8,
          }}
        >
          {mode === "create"
            ? "QR kodu okutarak veya kodu paylaşarak\ndiğer oyuncuları lobiye davet edebilirsin"
            : "QR kodu okutarak veya kodu girerek lobiye katılabilirsin"}
        </div>
      </div>
    </div>
  );
}
