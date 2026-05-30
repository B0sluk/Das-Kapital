import { useState, useEffect, useRef } from "react";
import { FONT_TITLE, FONT_MONO, RED } from "../../constants";
import { validatePlayerName } from "../../utils/validation";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "KAP-";
  for (let i = 0; i < 4; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function NameScreen({ onJoin }) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState("create"); // "create" | "join"
  const [joinCode, setJoinCode] = useState("");
  const [generatedCode] = useState(generateCode);
  const nameRef = useRef(null);
  const codeRef = useRef(null);

  // Firebase Setup Modal state
  const [showSettings, setShowSettings] = useState(false);
  const [firebaseConfigText, setFirebaseConfigText] = useState("");
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  useEffect(() => {
    nameRef.current?.focus();

    // Check if Firebase is currently configured
    const localConfig = localStorage.getItem("das_kapital_firebase_config");
    const hasEnvConfig = !!(
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_DATABASE_URL
    );
    setIsFirebaseConnected(!!localConfig || hasEnvConfig);

    if (localConfig) {
      setFirebaseConfigText(localConfig);
    }
  }, []);

  // Pre-fill Join Code if present in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setJoinCode(code.toUpperCase());
      setMode("join");
    }
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

    const validation = validatePlayerName(name);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const n = validation.value;
    if (mode === "create") {
      onJoin(n, generatedCode, true);
    } else {
      onJoin(n, joinCode.trim().toUpperCase(), false);
    }
  }

  function handleSaveFirebase() {
    try {
      // Try to parse as JSON first
      let parsed = null;
      try {
        parsed = JSON.parse(firebaseConfigText);
      } catch (e) {
        // If not JSON, try to extract keys using regex (helpful for JS SDK snippets)
        const extractKey = (key) => {
          const match = firebaseConfigText.match(
            new RegExp(`${key}:\\s*["']([^"']+)["']`),
          );
          return match ? match[1] : null;
        };

        parsed = {
          apiKey: extractKey("apiKey"),
          authDomain: extractKey("authDomain"),
          databaseURL: extractKey("databaseURL"),
          projectId: extractKey("projectId"),
          storageBucket: extractKey("storageBucket"),
          messagingSenderId: extractKey("messagingSenderId"),
          appId: extractKey("appId"),
        };
      }

      if (parsed && parsed.databaseURL && parsed.apiKey) {
        localStorage.setItem(
          "das_kapital_firebase_config",
          JSON.stringify(parsed),
        );
        alert("Firebase ayarları kaydedildi! Sayfa yenileniyor...");
        window.location.reload();
      } else {
        alert(
          "Geçersiz Firebase Config. apiKey ve databaseURL alanları zorunludur.",
        );
      }
    } catch (err) {
      alert("Ayar kaydedilirken hata oluştu. Lütfen formatı kontrol edin.");
    }
  }

  function handleClearFirebase() {
    localStorage.removeItem("das_kapital_firebase_config");
    alert("Özel Firebase ayarları silindi. Sayfa yenileniyor...");
    window.location.reload();
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
        position: "relative",
      }}
    >
      {/* Firebase Status Badge & Settings Toggle */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontFamily: FONT_MONO,
            padding: "3px 8px",
            borderRadius: 12,
            background: isFirebaseConnected ? "#102c10" : "#2c1010",
            color: isFirebaseConnected ? "#2ecc71" : "#e74c3c",
            border: `1px solid ${isFirebaseConnected ? "#2ecc7130" : "#e74c3c30"}`,
          }}
        >
          {isFirebaseConnected ? "● ONLINE (FIREBASE)" : "● OFFLINE (YEREL)"}
        </span>
        {!(
          import.meta.env.VITE_FIREBASE_API_KEY &&
          import.meta.env.VITE_FIREBASE_DATABASE_URL
        ) && (
          <button
            onClick={() => setShowSettings(true)}
            style={{
              background: "#141414",
              border: "1px solid #2a2a2a",
              borderRadius: 4,
              width: 28,
              height: 28,
              cursor: "pointer",
              color: "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Firebase Ayarları"
          >
            ⚙️
          </button>
        )}
      </div>

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
          <button
            style={tabStyle(mode === "create")}
            onClick={() => setMode("create")}
          >
            YENİ LOBİ
          </button>
          <button
            style={tabStyle(mode === "join")}
            onClick={() => setMode("join")}
          >
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
            <span style={{ color: "#666", letterSpacing: 2 }}>
              {generatedCode}
            </span>
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

      {/* Firebase Config Modal Settings Overlay */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#0f0f0f",
              border: "1px solid #222",
              borderRadius: 8,
              width: "100%",
              maxWidth: 380,
              padding: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                fontFamily: FONT_TITLE,
                fontSize: 20,
                color: RED,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              FİREBASE AYARLARI
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#666",
                fontFamily: FONT_MONO,
                lineHeight: 1.5,
                marginBottom: 16,
              }}
            >
              Online oynamak için Firebase Realtime Database config kodunuzu
              buraya yapıştırın (JSON veya JS nesnesi formatında). databaseURL
              alanı dolu olmalıdır.
            </div>

            <textarea
              value={firebaseConfigText}
              onChange={(e) => setFirebaseConfigText(e.target.value)}
              placeholder='{\n  "apiKey": "...",\n  "databaseURL": "https://..."\n}'
              style={{
                width: "100%",
                height: 140,
                background: "#080808",
                border: "1px solid #333",
                borderRadius: 4,
                color: "#2ecc71",
                fontFamily: FONT_MONO,
                fontSize: 11,
                padding: 10,
                outline: "none",
                marginBottom: 16,
                resize: "none",
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowSettings(false)}
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
                KAPAT
              </button>
              <button
                onClick={handleClearFirebase}
                style={{
                  padding: "10px 14px",
                  fontFamily: FONT_TITLE,
                  fontSize: 13,
                  letterSpacing: 1,
                  background: "#1a0505",
                  color: "#e74c3c",
                  border: "1px solid #e74c3c40",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                TEMİZLE
              </button>
              <button
                onClick={handleSaveFirebase}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontFamily: FONT_TITLE,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  background: RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                KAYDET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
