import { useState } from "react";
import GlobalStyle from "./components/GlobalStyle";
import NameScreen from "./components/lobby/NameScreen";
import LobbyScreen from "./components/lobby/LobbyScreen";
import Header from "./components/main/Header";
import ResourcesTab from "./components/main/ResourcesTab";
import CompaniesTab from "./components/main/CompaniesTab";
import CardsTab from "./components/main/CardsTab";
import BottomBar from "./components/main/BottomBar";
import NotificationsPanel from "./components/panels/NotificationsPanel";
import PlayersPanel from "./components/panels/PlayersPanel";
import SendPanel from "./components/panels/SendPanel";
import QuarterVotePanel from "./components/panels/QuarterVotePanel";
import {
  RESOURCES,
  COMPANIES,
  ALL_PLAYERS,
  MOCK_PLAYERS,
  FONT_TITLE,
  FONT_MONO,
  RED,
} from "./constants";
import { ts } from "./utils/helpers";
import { initRes, initCos, initOtherShares } from "./utils/gameHelpers";

export default function App() {
  const [phase, setPhase] = useState("name");
  const [myName, setMyName] = useState("");

  // Game state
  const [muli, setMuli] = useState(25.0);
  const [res, setRes] = useState(initRes);
  const [cos, setCos] = useState(initCos);
  const [otherShares] = useState(initOtherShares);
  const [notifs, setNotifs] = useState([
    { id: 0, msg: "Oyun başladı. İyi şanslar, işçi.", t: ts() },
  ]);
  const [unread, setUnread] = useState(1);
  const [view, setView] = useState("main");
  const [sendTo, setSendTo] = useState(null);
  const [basket, setBasket] = useState({});
  const [tab, setTab] = useState("res");
  const [quarter, setQuarter] = useState(1);
  const [firstPlayer, setFirstPlayer] = useState("SEN");
  const [cardSearch, setCardSearch] = useState("");
  const [cardFilter, setCardFilter] = useState("all");
  const [activeCards, setActiveCards] = useState([]);
  const [votes, setVotes] = useState({});
  const [nextFP, setNextFP] = useState(null);

  function notify(msg) {
    setNotifs((p) => [{ id: Date.now(), msg, t: ts() }, ...p].slice(0, 30));
    setUnread((u) => u + 1);
  }

  // Resource actions
  function buyRes(id) {
    const price = +(res[id].base * 1.5).toFixed(2);
    if (muli < price) {
      notify("⚠ Yetersiz Muli");
      return;
    }
    setMuli((m) => +(m - price).toFixed(2));
    setRes((p) => {
      const n = { ...p[id], amount: p[id].amount + 1, buys: p[id].buys + 1 };
      if (n.buys > 0 && n.buys % 3 === 0) n.base = +(n.base + 1).toFixed(1);
      return { ...p, [id]: n };
    });
    notify(
      `SEN → STOCK: ${RESOURCES.find((x) => x.id === id).name} ×1 (−${price}M)`,
    );
  }

  function sellRes(id) {
    if (res[id].amount < 1) return;
    const price = res[id].base;
    setMuli((m) => +(m + price).toFixed(2));
    setRes((p) => {
      const n = { ...p[id], amount: p[id].amount - 1, sells: p[id].sells + 1 };
      if (n.sells > 0 && n.sells % 3 === 0 && n.base > 0.5)
        n.base = +(n.base - 1).toFixed(1);
      return { ...p, [id]: n };
    });
    notify(
      `SEN ← STOCK: ${RESOURCES.find((x) => x.id === id).name} ×1 (+${price.toFixed(1)}M)`,
    );
  }

  function earnRes(id) {
    setRes((p) => ({ ...p, [id]: { ...p[id], amount: p[id].amount + 1 } }));
    notify(`SEN EARN: +1 ${RESOURCES.find((x) => x.id === id).name}`);
  }

  function spendRes(id) {
    if (res[id].amount < 1) return;
    setRes((p) => ({ ...p, [id]: { ...p[id], amount: p[id].amount - 1 } }));
    notify(`SEN SPEND: −1 ${RESOURCES.find((x) => x.id === id).name}`);
  }

  // Company actions
  function buyShare(id) {
    const price = +(cos[id].price * 1.5).toFixed(2);
    if (muli < price) {
      notify("⚠ Yetersiz Muli");
      return;
    }
    setMuli((m) => +(m - price).toFixed(2));
    setCos((p) => {
      const n = { ...p[id], shares: p[id].shares + 1, buys: p[id].buys + 1 };
      if (n.buys > 0 && n.buys % 3 === 0) n.price = +(n.price + 1).toFixed(1);
      return { ...p, [id]: n };
    });
    notify(
      `SEN → ${COMPANIES.find((x) => x.id === id).code} hisse ×1 (−${price}M)`,
    );
  }

  function sellShare(id) {
    if (cos[id].shares < 1) return;
    const price = cos[id].price;
    setMuli((m) => +(m + price).toFixed(2));
    setCos((p) => {
      const n = { ...p[id], shares: p[id].shares - 1, sells: p[id].sells + 1 };
      if (n.sells > 0 && n.sells % 3 === 0 && n.price > 1)
        n.price = +(n.price - 1).toFixed(1);
      return { ...p, [id]: n };
    });
    notify(
      `SEN ← ${COMPANIES.find((x) => x.id === id).code} hisse ×1 (+${price.toFixed(1)}M)`,
    );
  }

  // Trade
  function startSend(player) {
    setSendTo(player);
    setBasket({});
    setView("send");
  }

  function adjustBasket(id, delta) {
    setBasket((b) => ({
      ...b,
      [id]: Math.max(0, Math.min(res[id].amount, (b[id] || 0) + delta)),
    }));
  }

  function executeSend() {
    const items = Object.entries(basket).filter(([, v]) => v > 0);
    if (!items.length) return;
    setRes((p) => {
      const u = { ...p };
      items.forEach(([id, amt]) => {
        u[id] = { ...u[id], amount: u[id].amount - amt };
      });
      return u;
    });
    const desc = items
      .map(([id, amt]) => `${amt}×${RESOURCES.find((r) => r.id === id).name}`)
      .join(", ");
    notify(`SEN → ${sendTo}: ${desc} (GERİ ALINAMAZ)`);
    setView("main");
    setSendTo(null);
    setBasket({});
  }

  // Cards
  function toggleCard(cardId) {
    setActiveCards((p) =>
      p.find((c) => c.id === cardId)
        ? p.filter((c) => c.id !== cardId)
        : [...p, { id: cardId, used: true }],
    );
  }

  function toggleUsed(cardId) {
    setActiveCards((p) =>
      p.map((c) => (c.id === cardId ? { ...c, used: !c.used } : c)),
    );
  }

  // Quarter vote
  function startVote() {
    setVotes(Object.fromEntries(ALL_PLAYERS.map((p) => [p, null])));
    setNextFP(null);
    setView("quarter-vote");
  }

  function castVote(player, approve) {
    setVotes((v) => {
      const u = { ...v, [player]: approve ? "approved" : "rejected" };
      if (player === "SEN" && approve) {
        MOCK_PLAYERS.forEach((mp) => {
          u[mp] = "approved";
        });
      }
      return u;
    });
  }

  function finalizeQuarter() {
    if (!nextFP) return;
    setQuarter((q) => q + 1);
    setFirstPlayer(nextFP);
    setActiveCards([]);
    notify(`Q${quarter + 1} başladı. First Player: ${nextFP}`);
    setView("main");
    setTab("res");
  }

  // ── PHASE: NAME ──────────────────────────────────────────────────────
  if (phase === "name") {
    return (
      <>
        <GlobalStyle />
        <NameScreen
          onJoin={(name) => {
            setMyName(name);
            setPhase("lobby");
          }}
        />
      </>
    );
  }

  // ── PHASE: LOBBY ─────────────────────────────────────────────────────
  if (phase === "lobby") {
    return (
      <>
        <GlobalStyle />
        <LobbyScreen myName={myName} onBegin={() => setPhase("game")} />
      </>
    );
  }

  // ── PHASE: GAME ──────────────────────────────────────────────────────
  return (
    <>
      <GlobalStyle />
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          color: "#ddd6c8",
          fontFamily: "'Overpass',system-ui,sans-serif",
          overflow: "hidden",
          maxWidth: 480,
          margin: "0 auto",
          borderLeft: "1px solid #181818",
          borderRight: "1px solid #181818",
        }}
      >
        {/* HEADER */}
        {view === "main" && (
          <Header
            myName={myName}
            muli={muli}
            unread={unread}
            quarter={quarter}
            firstPlayer={firstPlayer}
            onNotificationsClick={() => {
              setView("notifs");
              setUnread(0);
            }}
          />
        )}

        {/* MAIN TABS */}
        {view === "main" && (
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #181818",
              flexShrink: 0,
              background: "#0d0d0d",
            }}
          >
            {[
              ["res", "KAYNAKLAR"],
              ["cos", "ŞİRKETLER"],
              ["cards", "KARTLAR"],
            ].map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "9px 4px",
                  textAlign: "center",
                  fontFamily: FONT_TITLE,
                  fontSize: 13,
                  letterSpacing: 1.5,
                  background: "none",
                  border: "none",
                  color: tab === t ? RED : "#444",
                  borderBottom: `2px solid ${tab === t ? RED : "transparent"}`,
                }}
              >
                {label}
                {t === "cards" && activeCards.length > 0 && (
                  <span
                    style={{
                      marginLeft: 4,
                      background: RED,
                      color: "#fff",
                      borderRadius: 9,
                      fontSize: 9,
                      padding: "0 5px",
                      fontFamily: FONT_MONO,
                      verticalAlign: "middle",
                    }}
                  >
                    {activeCards.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* MAIN VIEW */}
        {view === "main" && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            {tab === "res" && (
              <ResourcesTab
                res={res}
                muli={muli}
                onBuyRes={buyRes}
                onSellRes={sellRes}
                onEarnRes={earnRes}
                onSpendRes={spendRes}
              />
            )}
            {tab === "cos" && (
              <CompaniesTab
                cos={cos}
                otherShares={otherShares}
                onBuyShare={buyShare}
                onSellShare={sellShare}
              />
            )}
            {tab === "cards" && (
              <CardsTab
                activeCards={activeCards}
                cardSearch={cardSearch}
                cardFilter={cardFilter}
                onCardSearch={setCardSearch}
                onCardFilter={setCardFilter}
                onToggleCard={toggleCard}
                onToggleUsed={toggleUsed}
              />
            )}
          </div>
        )}

        {/* NOTIFICATIONS PANEL */}
        {view === "notifs" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <NotificationsPanel
              notifs={notifs}
              onClose={() => setView("main")}
            />
          </div>
        )}

        {/* PLAYERS PANEL */}
        {view === "players" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <PlayersPanel onClose={() => setView("main")} onSend={startSend} />
          </div>
        )}

        {/* SEND PANEL */}
        {view === "send" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <SendPanel
              sendTo={sendTo}
              basket={basket}
              onAdjustBasket={adjustBasket}
              onExecuteSend={executeSend}
              onBack={() => setView("players")}
            />
          </div>
        )}

        {/* QUARTER VOTE PANEL */}
        {view === "quarter-vote" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <QuarterVotePanel
              quarter={quarter}
              votes={votes}
              nextFP={nextFP}
              onCastVote={castVote}
              onSetNextFP={setNextFP}
              onFinalizeQuarter={finalizeQuarter}
              onCancel={() => setView("main")}
            />
          </div>
        )}

        {/* BOTTOM BAR */}
        {view === "main" && (
          <BottomBar
            activeCardsCount={activeCards.length}
            onAddCard={() => setTab("cards")}
            onQuarterChange={startVote}
            onPlayersClick={() => setView("players")}
          />
        )}
      </div>
    </>
  );
}
