import { useState, useEffect, useRef } from "react";
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
import MarketCardPanel from "./components/panels/MarketCardPanel";
import CardVotePanel from "./components/panels/CardVotePanel";
import MoneyLossPanel from "./components/panels/MoneyLossPanel";
import MoneyEditPanel from "./components/panels/MoneyEditPanel";
import { RESOURCES, COMPANIES, FONT_TITLE, FONT_MONO, RED } from "./constants";
import { ts } from "./utils/helpers";
import { initRes, initCos, getRandomElement } from "./utils/gameHelpers";
import { validateAmount, createSafeNotif } from "./utils/validation";
import { applyCardEffect, getEffectDescription } from "./utils/cardHelpers";
import { ALL_CARDS } from "./constants/cards";

// Firebase imports
import { initFirebase } from "./utils/firebase";
import { ref, set, update, onValue, get } from "firebase/database";

export default function App() {
  const [phase, setPhase] = useState("name");
  const [myName, setMyName] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [isHost, setIsHost] = useState(true);

  // Dynamic players list
  const [players, setPlayers] = useState(["SEN"]);
  const [activePlayer, setActivePlayer] = useState("SEN"); // UI: hangi oyuncunun verisi gösteriliyor
  const [turnPlayer, setTurnPlayer] = useState("SEN");     // Sıra kimin (Firebase'den)
  const firebaseTurnPlayerRef = useRef(null);

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

  // Card voting state
  const [currentCardVote, setCurrentCardVote] = useState(null);

  // Money loss state
  const [moneyLossCard, setMoneyLossCard] = useState(null);

  // Money edit panel state
  const [moneyEditTarget, setMoneyEditTarget] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Price vote state (Firebase-synced)
  const [priceVote, setPriceVote] = useState(null);
  const [activeVote, setActiveVote] = useState(null);

  // Rate limiting - prevent spam actions
  const [lastActionTime, setLastActionTime] = useState(0);
  const RATE_LIMIT_MS = 300; // 300ms between actions

  // Firebase client references
  const [db, setDb] = useState(null);

  // Initialize Firebase client on startup
  useEffect(() => {
    const client = initFirebase();
    if (client && client.db) {
      setDb(client.db);
    }
  }, []);

  // Detect code from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setSessionCode(code.toUpperCase());
      setIsHost(false);
    }
  }, []);

  // Real-time synchronization listener
  useEffect(() => {
    if (!db || !sessionCode || phase === "name") return;

    const lobbyRef = ref(db, `lobbies/${sessionCode}`);
    const unsubscribe = onValue(lobbyRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      if (data.players) setPlayers(data.players);
      if (data.status && data.status !== phase) {
        setPhase(data.status);
      }
      if (data.quarter) setQuarter(data.quarter);
      if (data.firstPlayer) setFirstPlayer(data.firstPlayer);
      if (data.activePlayer && data.activePlayer !== firebaseTurnPlayerRef.current) {
        firebaseTurnPlayerRef.current = data.activePlayer;
        setTurnPlayer(data.activePlayer);
      }
      if (data.playerMulis) setPlayerMulis(data.playerMulis);
      if (data.playerRes) setPlayerRes(data.playerRes);
      if (data.playerCos) setPlayerCos(data.playerCos);
      if (data.res) setRes(data.res);
      if (data.cos) setCos(data.cos);
      if (data.notifs) setNotifs(data.notifs);
      if (data.activeCards !== undefined)
        setActiveCards(data.activeCards || []);
      if (data.votes) setVotes(data.votes || {});
      if (data.nextFP !== undefined) setNextFP(data.nextFP);
      if (data.priceVote !== undefined) {
        const newPV = data.priceVote || null;
        setPriceVote(newPV);
        if (newPV?.active) {
          setView((v) => (v === "price-edit" ? v : "price-edit"));
        }
      }
      const incomingVote = data.activeVote || null;
      setActiveVote((prev) => {
        if (incomingVote !== prev) {
          if (incomingVote === "quarter") {
            setView((v) => (v === "quarter-vote" ? v : "quarter-vote"));
          }
        }
        return incomingVote;
      });
    });

    return () => unsubscribe();
  }, [db, sessionCode, phase, quarter]);

  // Toast notifier sync on new notifications from Firebase
  const [prevNotifsCount, setPrevNotifsCount] = useState(0);
  useEffect(() => {
    if (notifs.length > 0) {
      if (notifs.length > prevNotifsCount) {
        const latestMsg = notifs[0].msg;
        if (notifs[0].id !== 0) {
          setToast(latestMsg);
          setUnread((u) => u + 1);
        }
      }
      setPrevNotifsCount(notifs.length);
    }
  }, [notifs]);

  // General state update mechanism
  function updateGameData(updates) {
    if (db && sessionCode) {
      update(ref(db, `lobbies/${sessionCode}`), updates).catch((err) => {
        console.error("Firebase update error:", err);
      });
    } else {
      // Local updates fallback
      if (updates.playerMulis) setPlayerMulis(updates.playerMulis);
      if (updates.playerRes) setPlayerRes(updates.playerRes);
      if (updates.playerCos) setPlayerCos(updates.playerCos);
      if (updates.res) setRes(updates.res);
      if (updates.cos) setCos(updates.cos);
      if (updates.notifs) setNotifs(updates.notifs);
      if (updates.activeCards !== undefined)
        setActiveCards(updates.activeCards);
      if (updates.votes) setVotes(updates.votes);
      if (updates.nextFP !== undefined) setNextFP(updates.nextFP);
      if (updates.priceVote !== undefined) setPriceVote(updates.priceVote || null);
      if (updates.quarter) setQuarter(updates.quarter);
      if (updates.firstPlayer) setFirstPlayer(updates.firstPlayer);
      if (updates.activePlayer) setTurnPlayer(updates.activePlayer);
    }
  }

  function notify(msg) {
    // XSS Protection - sanitize message
    if (!msg || typeof msg !== "string") return;

    const time = ts();
    // Remove any HTML/script attempts from message
    const div = document.createElement("div");
    div.textContent = msg;
    const safeMsgHtml = div.innerHTML;

    const newNotif = { id: Date.now(), msg: safeMsgHtml, t: time };

    if (db && sessionCode) {
      get(ref(db, `lobbies/${sessionCode}/notifs`)).then((snapshot) => {
        const currentNotifs = snapshot.val() || [];
        const updated = [newNotif, ...currentNotifs].slice(0, 30);
        update(ref(db, `lobbies/${sessionCode}`), { notifs: updated });
      });
    } else {
      setNotifs((p) => [newNotif, ...p].slice(0, 30));
      setUnread((u) => u + 1);
      setToast(msg);
    }
  }

  // Clear toast automatically after 4 seconds
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

    if (db) {
      const lobbyRef = ref(db, `lobbies/${code}`);
      if (hostMode) {
        // Create Lobby on Firebase
        set(lobbyRef, {
          host: name,
          status: "lobby",
          players: [name],
          createdAt: Date.now(),
        }).then(() => {
          setPlayers([name]);
          setPhase("lobby");
        });
      } else {
        // Join existing Lobby
        get(lobbyRef).then((snapshot) => {
          const lobbyData = snapshot.val() || {};
          const currentPlayers = lobbyData.players || [];
          const currentStatus = lobbyData.status || "lobby";
          if (!currentPlayers.includes(name)) {
            const updated = [...currentPlayers, name];
            update(lobbyRef, { players: updated }).then(() => {
              setPlayers(updated);
              setPhase("lobby");
            });
          } else {
            // Rejoin: player already in list (dropped and reconnecting)
            setPlayers(currentPlayers);
            setPhase(currentStatus);
          }
        });
      }
    } else {
      // Local fallback mode
      const initialPlayers = hostMode ? [name] : ["SEN", name];
      setPlayers(initialPlayers);
      setActivePlayer(initialPlayers[0]);
      setFirstPlayer(initialPlayers[0]);
      setPhase("lobby");
    }
  }

  function handleAddPlayer(name) {
    if (!players.includes(name)) {
      const updated = [...players, name];
      setPlayers(updated);
      if (db) {
        update(ref(db, `lobbies/${sessionCode}`), { players: updated });
      }
    } else {
      notify(`⚠ "${name}" zaten oyuncu listesinde var!`);
    }
  }

  function handleRemovePlayer(name) {
    const updated = players.filter((p) => p !== name);
    if (db) {
      update(ref(db, `lobbies/${sessionCode}`), { players: updated });
    } else {
      setPlayers(updated);
    }
  }

  function startGame() {
    const initialRes = initRes();
    const initialCos = initCos();

    const initialPlayerRes = {};
    const initialPlayerCos = {};
    const initialPlayerMulis = {};

    players.forEach((p) => {
      initialPlayerMulis[p] = 10.0;
      initialPlayerRes[p] = Object.fromEntries(
        RESOURCES.map((r) => [r.id, r.id === "waste" ? 0 : 2]),
      );
      initialPlayerCos[p] = Object.fromEntries(COMPANIES.map((c) => [c.id, 0]));
    });

    // Random starting player for turn system
    const randomStartPlayer = getRandomElement(players);

    const initialNotifs = [
      { id: Date.now(), msg: `🎲 Oyun başladı! İlk Oyuncu: ${randomStartPlayer}. İyi şanslar, işçi.`, t: ts() },
    ];

    if (db) {
      update(ref(db, `lobbies/${sessionCode}`), {
        status: "game",
        res: initialRes,
        cos: initialCos,
        playerMulis: initialPlayerMulis,
        playerRes: initialPlayerRes,
        playerCos: initialPlayerCos,
        notifs: initialNotifs,
        quarter: 1,
        firstPlayer: randomStartPlayer,
        activePlayer: randomStartPlayer,
      });
    } else {
      setPlayerMulis(initialPlayerMulis);
      setPlayerRes(initialPlayerRes);
      setPlayerCos(initialPlayerCos);
      setRes(initialRes);
      setCos(initialCos);
      setNotifs(initialNotifs);
      setFirstPlayer(randomStartPlayer);
      setTurnPlayer(randomStartPlayer);
      setActivePlayer(randomStartPlayer);
      setPhase("game");
    }
  }

  // Resource actions
  function buyRes(player, id) {
    if (myName !== player) {
      notify("Sadece kendini için aksiyon alabilirsin!");
      return;
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const price = +(res[id].base * 1.5).toFixed(2);
    const muli = playerMulis[player] || 0;
    if (muli < price) {
      notify(`⚠ ${player}: Yetersiz Muli`);
      return;
    }

    const updatedMulis = {
      ...playerMulis,
      [player]: +(muli - price).toFixed(2),
    };

    const updatedRes = {
      ...playerRes,
      [player]: {
        ...playerRes[player],
        [id]: (playerRes[player]?.[id] || 0) + 1,
      },
    };

    const nextResData = { ...res };
    const n = { ...res[id], buys: res[id].buys + 1 };
    if (n.buys > 0 && n.buys % 3 === 0) n.base = +(n.base + 1).toFixed(1);
    nextResData[id] = n;

    updateGameData({
      playerMulis: updatedMulis,
      playerRes: updatedRes,
      res: nextResData,
    });

    notify(
      `🛒 ${player} ALDI: ${RESOURCES.find((x) => x.id === id).name} ×1 (−${price}M)`,
    );
  }

  function sellRes(player, id) {
    if (myName !== player) {
      notify("Sadece kendini için aksiyon alabilirsin!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const amount = playerRes[player]?.[id] || 0;
    if (amount < 1) return;
    const price = res[id].base;

    const updatedMulis = {
      ...playerMulis,
      [player]: +(playerMulis[player] + price).toFixed(2),
    };

    const updatedRes = {
      ...playerRes,
      [player]: {
        ...playerRes[player],
        [id]: playerRes[player][id] - 1,
      },
    };

    const nextResData = { ...res };
    const n = { ...res[id], sells: res[id].sells + 1 };
    if (n.sells > 0 && n.sells % 3 === 0 && n.base > 0.5)
      n.base = +(n.base - 1).toFixed(1);
    nextResData[id] = n;

    updateGameData({
      playerMulis: updatedMulis,
      playerRes: updatedRes,
      res: nextResData,
    });

    notify(
      `💰 ${player} SATTI: ${RESOURCES.find((x) => x.id === id).name} ×1 (+${price.toFixed(1)}M)`,
    );
  }

  function earnRes(player, id) {
    if (myName !== player) {
      notify("Sadece kendini için aksiyon alabilirsin!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const updatedRes = {
      ...playerRes,
      [player]: {
        ...playerRes[player],
        [id]: (playerRes[player]?.[id] || 0) + 1,
      },
    };

    updateGameData({ playerRes: updatedRes });
    notify(
      `➕ ${player} KAZANDI: 1x ${RESOURCES.find((x) => x.id === id).name}`,
    );
  }

  function spendRes(player, id) {
    if (myName !== player) {
      notify("Sadece kendini için aksiyon alabilirsin!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const amount = playerRes[player]?.[id] || 0;
    if (amount < 1) return;

    const updatedRes = {
      ...playerRes,
      [player]: {
        ...playerRes[player],
        [id]: amount - 1,
      },
    };

    updateGameData({ playerRes: updatedRes });
    notify(
      `➖ ${player} HARCADI: 1x ${RESOURCES.find((x) => x.id === id).name}`,
    );
  }

  // Company actions
  function buyShare(player, id) {
    if (myName !== player) {
      notify("Sadece kendini için aksiyon alabilirsin!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const price = +(cos[id].price * 1.5).toFixed(2);
    const muli = playerMulis[player] || 0;
    if (muli < price) {
      notify(`⚠ ${player}: Yetersiz Muli`);
      return;
    }

    const updatedMulis = {
      ...playerMulis,
      [player]: +(muli - price).toFixed(2),
    };

    const updatedCos = {
      ...playerCos,
      [player]: {
        ...playerCos[player],
        [id]: (playerCos[player]?.[id] || 0) + 1,
      },
    };

    const nextCosData = { ...cos };
    const n = { ...cos[id], buys: cos[id].buys + 1 };
    if (n.buys > 0 && n.buys % 3 === 0) n.price = +(n.price + 1).toFixed(1);
    nextCosData[id] = n;

    updateGameData({
      playerMulis: updatedMulis,
      playerCos: updatedCos,
      cos: nextCosData,
    });

    notify(
      `📈 ${player} HİSSE ALDI: ${COMPANIES.find((x) => x.id === id).code} ×1 (−${price}M)`,
    );
  }

  function sellShare(player, id) {
    if (myName !== player) {
      notify("Sadece kendini için aksiyon alabilirsin!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const sharesOwned = playerCos[player]?.[id] || 0;
    if (sharesOwned < 1) return;
    const price = cos[id].price;

    const updatedMulis = {
      ...playerMulis,
      [player]: +(playerMulis[player] + price).toFixed(2),
    };

    const updatedCos = {
      ...playerCos,
      [player]: {
        ...playerCos[player],
        [id]: playerCos[player][id] - 1,
      },
    };

    const nextCosData = { ...cos };
    const n = { ...cos[id], sells: cos[id].sells + 1 };
    if (n.sells > 0 && n.sells % 3 === 0 && n.price > 1)
      n.price = +(n.price - 1).toFixed(1);
    nextCosData[id] = n;

    updateGameData({
      playerMulis: updatedMulis,
      playerCos: updatedCos,
      cos: nextCosData,
    });

    notify(
      `📉 ${player} HİSSE SATTI: ${COMPANIES.find((x) => x.id === id).code} ×1 (+${price.toFixed(1)}M)`,
    );
  }

  // Trade
  function startSend(player) {
    if (myName !== turnPlayer) {
      notify("Sadece kendini için aksiyon alabilirsin!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    setSendTo(player);
    setBasket({});
    setView("send");
  }

  function adjustBasket(id, delta) {
    const myAmount = playerRes[myName]?.[id] || 0;
    setBasket((b) => ({
      ...b,
      [id]: Math.max(0, Math.min(myAmount, (b[id] || 0) + delta)),
    }));
  }

  function executeSend() {
    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const items = Object.entries(basket).filter(([, v]) => v > 0);
    if (!items.length) return;

    const updatedRes = { ...playerRes };
    const myRes = { ...playerRes[myName] };
    const targetRes = { ...playerRes[sendTo] };

    items.forEach(([id, amt]) => {
      myRes[id] = Math.max(0, myRes[id] - amt);
      targetRes[id] = (targetRes[id] || 0) + amt;
    });

    updatedRes[myName] = myRes;
    updatedRes[sendTo] = targetRes;

    updateGameData({ playerRes: updatedRes });

    const desc = items
      .map(([id, amt]) => `${amt}×${RESOURCES.find((r) => r.id === id).name}`)
      .join(", ");

    notify(`💸 TRANSFER: ${myName} → ${sendTo}: ${desc}`);
    setView("main");
    setSendTo(null);
    setBasket({});
  }

  // Cards
  function toggleCard(cardId) {
    if (myName !== turnPlayer) {
      notify("Sıran değil!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    // Check if card already exists
    const cardExists = activeCards.find((c) => c.id === cardId);

    if (cardExists) {
      // Remove card if already active
      const updatedCards = activeCards.filter((c) => c.id !== cardId);
      updateGameData({ activeCards: updatedCards });
    } else {
      // Find the card details
      const card = ALL_CARDS.find((c) => c.id === cardId);
      
      if (!card) return;

      // Check if it's a policy or event card (requires voting)
      if (card.type === "policy" || card.type === "event") {
        // Start voting process
        setCurrentCardVote(card);
        setView("card-vote");
      } else {
        // Add card directly (market cards)
        const updatedCards = [...activeCards, { id: cardId, used: true }];
        updateGameData({ activeCards: updatedCards });
      }
    }
  }

  function toggleUsed(cardId) {
    if (myName !== turnPlayer) {
      notify("Sıran değil!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const updatedCards = activeCards.map((c) =>
      c.id === cardId ? { ...c, used: !c.used } : c,
    );
    updateGameData({ activeCards: updatedCards });
  }

  // Card voting approval
  function approveCardVote() {
    if (!currentCardVote) return;

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const card = currentCardVote;
    const updatedCards = [...activeCards, { id: card.id, used: true }];

    // Apply card effect to market resources
    const updatedRes = applyCardEffect(card.effect, res);

    updateGameData({
      activeCards: updatedCards,
      res: updatedRes,
    });

    notify(
      `✓ ${card.type === "policy" ? "POLİTİKA" : "OLAY"} ONAYLANDI: ${card.name} - ${getEffectDescription(card.effect)}`,
    );

    setCurrentCardVote(null);
    setView("main");
  }

  // Card voting rejection
  function rejectCardVote() {
    if (!currentCardVote) return;

    const card = currentCardVote;
    notify(
      `✕ ${card.type === "policy" ? "POLİTİKA" : "OLAY"} REDDEDİLDİ: ${card.name}`,
    );

    setCurrentCardVote(null);
    setView("main");
  }

  // Money loss deduction
  function deductMoneyForCard(amount) {
    if (!moneyLossCard) return;

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const player = myName;
    const muli = playerMulis[player] || 0;
    const deductAmount = parseFloat(amount) || 0;

    if (deductAmount <= 0 || deductAmount > muli) {
      notify("Geçersiz tutar!");
      return;
    }

    const updatedMulis = {
      ...playerMulis,
      [player]: +(muli - deductAmount).toFixed(2),
    };

    updateGameData({ playerMulis: updatedMulis });
    notify(
      `💸 ${player} PARA KAYBETTI: "${moneyLossCard.name}" kartı için −${deductAmount.toFixed(2)}M`,
    );

    setMoneyLossCard(null);
    setView("main");
  }

  function adjustMoney(player, amount) {
    const current = playerMulis[player] || 0;
    const newVal = Math.max(0, +(current + amount).toFixed(2));
    const updatedMulis = { ...playerMulis, [player]: newVal };
    updateGameData({ playerMulis: updatedMulis });
    const sign = amount >= 0 ? "+" : "";
    notify(`💰 ${player} PARA: ${sign}${amount.toFixed(2)}M → Yeni bakiye: ${newVal.toFixed(2)}M`);
  }

  // Skip turn
  function skipTurn() {
    if (!players || players.length === 0) return;

    if (myName !== turnPlayer) {
      notify("Sıran değil!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) return;
    setLastActionTime(now);

    const idx = players.indexOf(turnPlayer);
    const nextPlayer = players[(idx + 1) % players.length];

    // Ref'i hemen güncelle, listener tekrar eski değeri yazmasın
    firebaseTurnPlayerRef.current = nextPlayer;
    setTurnPlayer(nextPlayer);

    if (db && sessionCode) {
      update(ref(db, `lobbies/${sessionCode}`), { activePlayer: nextPlayer }).catch((err) => {
        console.error("Firebase update error:", err);
        notify("Sıra geçme başarısız!");
        firebaseTurnPlayerRef.current = turnPlayer;
        setTurnPlayer(turnPlayer);
      });
    }

    notify(`⏭️ ${myName} SIRAYI GEÇTİ. Şimdi sıra: ${nextPlayer}`);
  }

  // Quarter vote
  function startVote() {
    if (myName !== turnPlayer) {
      notify("Sıran değil!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const initialVotes = Object.fromEntries(players.map((p) => [p, null]));
    updateGameData({
      votes: initialVotes,
      nextFP: null,
      activeVote: "quarter",
    });
    setView("quarter-vote");
  }

  function castVote(player, approve) {
    if (myName !== player) {
      notify("Sadece kendinin oyunu verebilirsin!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const updatedVotes = {
      ...votes,
      [player]: approve ? "approved" : "rejected",
    };
    // Host auto-approves others helper for mock players if any
    if (player === "SEN" && approve) {
      players.forEach((mp) => {
        if (mp !== "SEN") updatedVotes[mp] = "approved";
      });
    }
    updateGameData({ votes: updatedVotes });
  }

  function finalizeQuarter() {
    if (myName !== turnPlayer) {
      notify("Sıran değil!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    if (!nextFP) return;
    const nextQ = quarter + 1;
    updateGameData({
      quarter: nextQ,
      firstPlayer: nextFP,
      activeCards: [],
      votes: {},
      nextFP: null,
      status: "game",
      activeVote: null,
    });
    notify(`📢 Q${nextQ} başladı. First Player: ${nextFP}`);
    setView("main");
    setTab("res");
  }

  function handleStartPriceVote(proposedRes, proposedResBuySell, proposedCos, proposedCosBuySell) {
    updateGameData({
      activeVote: "price",
      priceVote: {
        active: true,
        proposed: {
          res: proposedRes,
          resBuySell: proposedResBuySell,
          cos: proposedCos,
          cosBuySell: proposedCosBuySell,
        },
      },
    });
  }

  // Price proposer / editor
  function handleProposePrices(proposedRes, proposedResBuySell, proposedCos, proposedCosBuySell) {
    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const nextResData = { ...res };
    Object.entries(proposedRes).forEach(([id, basePrice]) => {
      if (nextResData[id]) {
        nextResData[id] = { ...nextResData[id], base: basePrice };
      }
    });
    // Apply buy/sell for resources (should be same)
    if (proposedResBuySell) {
      Object.entries(proposedResBuySell).forEach(([id, { buys, sells }]) => {
        if (nextResData[id]) {
          nextResData[id] = { ...nextResData[id], buys, sells };
        }
      });
    }

    const nextCosData = { ...cos };
    Object.entries(proposedCos).forEach(([id, sharePrice]) => {
      if (nextCosData[id]) {
        nextCosData[id] = { ...nextCosData[id], price: sharePrice };
      }
    });
    // Apply buy/sell for companies
    if (proposedCosBuySell) {
      Object.entries(proposedCosBuySell).forEach(([id, { buys, sells }]) => {
        if (nextCosData[id]) {
          nextCosData[id] = { ...nextCosData[id], buys, sells };
        }
      });
    }

    updateGameData({
      res: nextResData,
      cos: nextCosData,
      activeVote: null,
      priceVote: null,
    });

    notify("🔔 FİYAT GÜNCELLEMESİ: Yeni piyasa fiyatları onaylandı!");
  }

  // Market card purchase deduction
  function buyMarketCard(player, cardName, amount) {
    if (myName !== player) {
      notify("Sadece kendini için aksiyon alabilirsin!");
      return;
    }

    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
      return;
    }
    setLastActionTime(now);

    const muli = playerMulis[player] || 0;
    const deductAmount = parseFloat(amount) || 0;

    if (deductAmount <= 0) {
      notify("Geçersiz tutar!");
      return;
    }

    if (muli < deductAmount) {
      notify(`⚠ Yetersiz Muli! (Mevcut: ${muli.toFixed(2)}M)`);
      return;
    }

    const updatedMulis = {
      ...playerMulis,
      [player]: +(muli - deductAmount).toFixed(2),
    };

    // Add market card to active cards
    const marketCard = {
      id: `market_${Date.now()}`,
      name: cardName,
      type: "market",
      effect: cardName,
      used: false,
    };

    const updatedCards = [...activeCards, marketCard];

    updateGameData({ 
      playerMulis: updatedMulis,
      activeCards: updatedCards,
    });
    notify(
      `🎴 ${player} PAZAR KARTI SATIN ALDI: "${cardName}" (−${deductAmount.toFixed(2)}M)`,
    );
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
            animation:
              "toastSlide 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards",
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
            muli={playerMulis[myName] || 0}
            unread={unread}
            quarter={quarter}
            firstPlayer={firstPlayer}
            onNotificationsClick={() => {
              setView("notifs");
              setUnread(0);
            }}
            onMoneyClick={() => {
              setMoneyEditTarget(myName);
              setView("money-edit");
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
                onMoneyLossClick={(card) => {
                  setMoneyLossCard(card);
                  setView("money-loss");
                }}
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
              mockPlayers={players.filter((p) => p !== activePlayer)}
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
              onClose={() => {
                setView("main");
                updateGameData({ activeVote: null, priceVote: null });
              }}
              onProposePrices={handleProposePrices}
              onStartVote={handleStartPriceVote}
              priceVote={priceVote}
            />
          </div>
        )}

        {/* MARKET CARD PANEL */}
        {view === "market-card" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <MarketCardPanel
              playerMuli={playerMulis[myName] || 0}
              onClose={() => setView("main")}
              onBuyCard={(cardName, amount) => buyMarketCard(myName, cardName, amount)}
            />
          </div>
        )}

        {/* CARD VOTE PANEL */}
        {view === "card-vote" && currentCardVote && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <CardVotePanel
              card={currentCardVote}
              players={players}
              onClose={() => {
                setCurrentCardVote(null);
                setView("main");
              }}
              onApprove={approveCardVote}
              onReject={rejectCardVote}
            />
          </div>
        )}

        {/* MONEY LOSS PANEL */}
        {view === "money-loss" && moneyLossCard && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <MoneyLossPanel
              playerMuli={playerMulis[myName] || 0}
              cardName={moneyLossCard.name}
              onClose={() => {
                setMoneyLossCard(null);
                setView("main");
              }}
              onDeductMoney={deductMoneyForCard}
            />
          </div>
        )}

        {/* MONEY EDIT PANEL */}
        {view === "money-edit" && (
          <MoneyEditPanel
            players={players}
            playerMulis={playerMulis}
            onClose={() => setView("main")}
            onAdjust={adjustMoney}
          />
        )}

        {/* BOTTOM BAR */}
        {view === "main" && (
          <BottomBar
            activeCardsCount={activeCards.length}
            onSkipTurn={skipTurn}
            onMarketCardClick={() => setView("market-card")}
            onPriceEditClick={() => setView("price-edit")}
            onQuarterChange={startVote}
            onPlayersClick={() => setView("players")}
          />
        )}
      </div>
    </>
  );
}
