import { RESOURCES, COMPANIES, MOCK_PLAYERS } from "../constants";

export function initRes() {
  return Object.fromEntries(
    RESOURCES.map(r => [
      r.id,
      {
        amount: 2,
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
        shares: 7,
        price: 5.0,
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

// Company tier levels unlock at specific share counts
export function getCompanyTiers(shares) {
  return [
    { level: 1, threshold: 0, label: "TIER 1", unlock: true },
    { level: 2, threshold: 3, label: "TIER 2", unlock: shares >= 3 },
    { level: 3, threshold: 5, label: "TIER 3", unlock: shares >= 5 },
    { level: 4, threshold: 7, label: "TIER 4", unlock: shares >= 7 },
  ];
}

// Get a random element from an array
export function getRandomElement(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}
