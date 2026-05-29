import { useState, useEffect } from "react";
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
import PriceEditPanel from "./components/panels/PriceEditPanel";
import {
  RESOURCES,
  COMPANIES,
  FONT_TITLE,
  FONT_MONO,
  RED,
} from "./constants";
import { ts } from "./utils/helpers";
import { initRes, initCos } from "./utils/gameHelpers";

export default function App() {
  const [phase, setPhase] = useState("name");
  const [myName, setMyName] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [isHost, setIsHost] = useState(true);

  // Dynamic players list
  const [players, setPlayers] = useState(["SEN"]);
  const [activePlayer, setActivePlayer] = useState("SEN");

  // Game state
  const [playerMulis, setPlayerMulis] = useState({});
  const [playerRes, setPlayerRes] = useState({});
  const [playerCos, setPlayerCos] = useState({});
  const [res, setRes] = useState({});
  const [cos, setCos] = useState({});

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

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Detect code from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setSessionCode(code.toUpperCase());
      setIsHost(false);
    }
  }, []);

  function notify(msg) {
    const time = ts();
    setNotifs((p) => [{ id: Date.now(), msg, t: time }, ...p].slice(0, 30));
    setUnread((u) => u + 1);
    
    // Set toast banner
    setToast(msg);
  }

  // Clear toast automatically
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function handleJoin(name, code, hostMode) {
    setMyName(name);
    setSessionCode(code);
    setIsHost(hostMode);
    
    const initialPlayers = hostMode ? [name] : ["SEN", name];
    setPlayers(initialPlayers);
    setActivePlayer(initialPlayers[0]);
    setFirstPlayer(initialPlayers[0]);
    setPhase("lobby");
  }

  function handleAddPlayer(name) {
    if (!players.includes(name)) {
      setPlayers((prev) => [...prev, name]);
    }
  }

  function handleRemovePlayer(name) {
    setPlayers((prev) => prev.filter((p) => p !== name));
  }

  function startGame() {
    const initialRes = initRes();
    const initialCos = initCos();

    const initialPlayerRes = {};
    const initialPlayerCos = {};
    const initialPlayerMulis = {};

    players.forEach((p) => {
      initialPlayerMulis[p] = 25.0;
      initialPlayerRes[p] = Object.fromEntries(
        RESOURCES.map((r) => [r.id, Math.floor(Math.random() * 4) + 2])
      );
      initialPlayerCos[p] = Object.fromEntries(
        COMPANIES.map((c) => [c.id, 0])
      );
    });

    setPlayerMulis(initialPlayerMulis);
    setPlayerRes(initialPlayerRes);
    setPlayerCos(initialPlayerCos);
    setRes(initialRes);
    setCos(initialCos);
    
    setPhase("game");
  }

  // Resource actions
  function buyRes(player, id) {
    const price = +(res[id].base * 1.5).toFixed(2);
    const muli = playerMulis[player] || 0;
    if (muli < price) {
      notify(`⚠ ${player}: Yetersiz Muli`);
      return;
    }
    
    setPlayerMulis((prev) => ({
      ...prev,
      [player]: +(prev[player] - price).toFixed(2),
    }));
    
    setPlayerRes((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [id]: (prev[player][id] || 0) + 1,
      },
    }));

    setRes((p) => {
      const n = { ...p[id], buys: p[id].buys + 1 };
      if (n.buys > 0 && n.buys % 3 === 0) n.base = +(n.base + 1).toFixed(1);
      return { ...p, [id]: n };
    });
    
    notify(
      `🛒 ${player} ALDI: ${RESOURCES.find((x) => x.id === id).name} ×1 (−${price}M)`
    );
  }

  function sellRes(player, id) {
    const amount = playerRes[player]?.[id] || 0;
    if (amount < 1) return;
    const price = res[id].base;
    
    setPlayerMulis((prev) => ({
      ...prev,
      [player]: +(prev[player] + price).toFixed(2),
    }));
    
    setPlayerRes((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [id]: prev[player][id] - 1,
      },
    }));

    setRes((p) => {
      const n = { ...p[id], sells: p[id].sells + 1 };
      if (n.sells > 0 && n.sells % 3 === 0 && n.base > 0.5)
        n.base = +(n.base - 1).toFixed(1);
      return { ...p, [id]: n };
    });
    
    notify(
      `💰 ${player} SATTI: ${RESOURCES.find((x) => x.id === id).name} ×1 (+${price.toFixed(1)}M)`
    );
  }

  function earnRes(player, id) {
    setPlayerRes((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [id]: (prev[player][id] || 0) + 1,
      },
    }));
    notify(`➕ ${player} KAZANDI: 1x ${RESOURCES.find((x) => x.id === id).name}`);
  }

  function spendRes(player, id) {
    const amount = playerRes[player]?.[id] || 0;
    if (amount < 1) return;
    
    setPlayerRes((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [id]: amount - 1,
      },
    }));
    notify(`➖ ${player} HARCADI: 1x ${RESOURCES.find((x) => x.id === id).name}`);
  }

  // Company actions
  function buyShare(player, id) {
    const price = +(cos[id].price * 1.5).toFixed(2);
    const muli = playerMulis[player] || 0;
    if (muli < price) {
      notify(`⚠ ${player}: Yetersiz Muli`);
      return;
    }
    
    setPlayerMulis((prev) => ({
      ...prev,
      [player]: +(prev[player] - price).toFixed(2),
    }));
    
    setPlayerCos((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [id]: (prev[player][id] || 0) + 1,
      },
    }));

    setCos((p) => {
      const n = { ...p[id], buys: p[id].buys + 1 };
      if (n.buys > 0 && n.buys % 3 === 0) n.price = +(n.price + 1).toFixed(1);
      return { ...p, [id]: n };
    });
    
    notify(
      `📈 ${player} HİSSE ALDI: ${COMPANIES.find((x) => x.id === id).code} ×1 (−${price}M)`
    );
  }

  function sellShare(player, id) {
    const sharesOwned = playerCos[player]?.[id] || 0;
    if (sharesOwned < 1) return;
    const price = cos[id].price;
    
    setPlayerMulis((prev) => ({
      ...prev,
      [player]: +(prev[player] + price).toFixed(2),
    }));
    
    setPlayerCos((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [id]: prev[player][id] - 1,
      },
    }));

    setCos((p) => {
      const n = { ...p[id], sells: p[id].sells + 1 };
      if (n.sells > 0 && n.sells % 3 === 0 && n.price > 1)
        n.price = +(n.price - 1).toFixed(1);
      return { ...p, [id]: n };
    });
    
    notify(
      `📉 ${player} HİSSE SATTI: ${COMPANIES.find((x) => x.id === id).code} ×1 (+${price.toFixed(1)}M)`
    );
  }

  // Trade
  function startSend(player) {
    setSendTo(player);
    setBasket({});
    setView("send");
  }

  function adjustBasket(id, delta) {
    const activePlayerAmount = playerRes[activePlayer]?.[id] || 0;
    setBasket((b) => ({
      ...b,
      [id]: Math.max(0, Math.min(activePlayerAmount, (b[id] || 0) + delta)),
    }));
  }

  function executeSend() {
    const items = Object.entries(basket).filter(([, v]) => v > 0);
    if (!items.length) return;
    
    setPlayerRes((prev) => {
      const activeRes = { ...prev[activePlayer] };
      const targetRes = { ...prev[sendTo] };
      
      items.forEach(([id, amt]) => {
        activeRes[id] = Math.max(0, activeRes[id] - amt);
        targetRes[id] = (targetRes[id] || 0) + amt;
      });
      
      return {
        ...prev,
        [activePlayer]: activeRes,
        [sendTo]: targetRes,
      };
    });
    
    const desc = items
      .map(([id, amt]) => `${amt}×${RESOURCES.find((r) => r.id === id).name}`)
      .join(", ");
      
    notify(`💸 TRANSFER: ${activePlayer} → ${sendTo}: ${desc}`);
    setView("main");
    setSendTo(null);
    setBasket({});
  }

  // Cards
  function toggleCard(cardId) {
    setActiveCards((p) =>
      p.find((c) => c.id === cardId)
        ? p.filter((c) => c.id !== cardId)
        : [...p, { id: cardId, used: true }]
    );
  }

  function toggleUsed(cardId) {
    setActiveCards((p) =>
      p.map((c) => (c.id === cardId ? { ...c, used: !c.used } : c))
    );
  }

  // Quarter vote
  function startVote() {
    setVotes(Object.fromEntries(players.map((p) => [p, null])));
    setNextFP(null);
    setView("quarter-vote");
  }

  function castVote(player, approve) {
    setVotes((v) => {
      const u = { ...v, [player]: approve ? "approved" : "rejected" };
      if (player === "SEN" && approve) {
        players.forEach((mp) => {
          if (mp !== "SEN") u[mp] = "approved";
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
    notify(`📢 Q${quarter + 1} başladı. First Player: ${nextFP}`);
    setView("main");
    setTab("res");
  }

  // Price proposer / editor
  function handleProposePrices(proposedRes, proposedCos) {
    // Update global resource base prices
    setRes((prev) => {
      const next = { ...prev };
      Object.entries(proposedRes).forEach(([id, basePrice]) => {
        if (next[id]) {
          next[id] = { ...next[id], base: basePrice };
        }
      });
      return next;
    });

    // Update global company share prices
    setCos((prev) => {
      const next = { ...prev };
      Object.entries(proposedCos).forEach(([id, sharePrice]) => {
        if (next[id]) {
          next[id] = { ...next[id], price: sharePrice };
        }
      });
      return next;
    });

    notify("🔔 FİYAT GÜNCELLEMESİ: Yeni piyasa fiyatları onaylandı!");
  }

  // ── PHASE: NAME ──────────────────────────────────────────────────────
  if (phase === "name") {
    return (
      <>
        <GlobalStyle />
        <NameScreen onJoin={handleJoin} />
      </>
    );
  }

  // ── PHASE: LOBBY ─────────────────────────────────────────────────────
  if (phase === "lobby") {
    return (
      <>
        <GlobalStyle />
        <LobbyScreen
          myName={myName}
          sessionCode={sessionCode}
          isHost={isHost}
          players={players}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onBegin={startGame}
        />
      </>
    );
  }

  // ── PHASE: GAME ──────────────────────────────────────────────────────
  return (
    <>
      <GlobalStyle />
      
      {/* Premium Slide-Down Toast Banner */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#180707",
            border: `1px solid ${RED}aa`,
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            zIndex: 9999,
            fontSize: 12,
            fontFamily: FONT_MONO,
            boxShadow: `0 0 20px ${RED}33`,
            animation: "toastSlide 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards",
            maxWidth: "90%",
            width: 320,
            textAlign: "center",
          }}
        >
          {toast}
        </div>
      )}

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
            muli={playerMulis[activePlayer] || 0}
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
                  cursor: "pointer",
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
                playerMulis={playerMulis}
                playerRes={playerRes}
                players={players}
                activePlayer={activePlayer}
                onSetActivePlayer={setActivePlayer}
                onBuyRes={buyRes}
                onSellRes={sellRes}
                onEarnRes={earnRes}
                onSpendRes={spendRes}
              />
            )}
            {tab === "cos" && (
              <CompaniesTab
                cos={cos}
                playerMulis={playerMulis}
                playerCos={playerCos}
                players={players}
                activePlayer={activePlayer}
                onSetActivePlayer={setActivePlayer}
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
            <PlayersPanel
              onClose={() => setView("main")}
              onSend={startSend}
              mockPlayers={players.filter((p) => p !== "SEN")}
            />
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
              players={players}
              nextFP={nextFP}
              onCastVote={castVote}
              onSetNextFP={setNextFP}
              onFinalizeQuarter={finalizeQuarter}
              onCancel={() => setView("main")}
            />
          </div>
        )}

        {/* PRICE EDIT PANEL */}
        {view === "price-edit" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <PriceEditPanel
              res={res}
              cos={cos}
              players={players}
              onClose={() => setView("main")}
              onProposePrices={handleProposePrices}
            />
          </div>
        )}

        {/* BOTTOM BAR */}
        {view === "main" && (
          <BottomBar
            activeCardsCount={activeCards.length}
            onAddCard={() => setTab("cards")}
            onPriceEditClick={() => setView("price-edit")}
            onQuarterChange={startVote}
            onPlayersClick={() => setView("players")}
          />
        )}
      </div>
    </>
  );
}
