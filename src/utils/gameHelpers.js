import { RESOURCES, COMPANIES, MOCK_PLAYERS } from "../constants";

export function initRes() {
  return Object.fromEntries(
    RESOURCES.map(r => [
      r.id,
      {
        amount: Math.floor(Math.random() * 5) + 2,
        base: parseFloat((Math.random() * 2 + 1).toFixed(1)),
        buys: 0,
        sells: 0,
      },
    ])
  );
}

export function initCos() {
  return Object.fromEntries(
    COMPANIES.map(c => [
      c.id,
      {
        shares: Math.floor(Math.random() * 3),
        price: parseFloat((Math.random() * 4 + 4).toFixed(1)),
        buys: 0,
        sells: 0,
      },
    ])
  );
}

export function initOtherShares() {
  const s = {};
  MOCK_PLAYERS.forEach(p => {
    s[p] = Object.fromEntries(COMPANIES.map(c => [c.id, Math.floor(Math.random() * 6)]));
  });
  return s;
}
