import { RESOURCES } from "../constants";

/**
 * Parse card effect string and return structured changes
 * Example: "Status ↑1, Labor ↓2" -> { status: 1, labor: -2 }
 */
export function parseCardEffect(effectString) {
  const changes = {};

  if (!effectString || typeof effectString !== "string") return changes;

  const parts = effectString.split(",").map((p) => p.trim());

  parts.forEach((part) => {
    // Match patterns like "Status ↑1" or "Labor ↓2"
    const match = part.match(/(\w+)\s*(↑|↓)(\d+)/);
    if (match) {
      const [, resource, direction, amount] = match;
      const resourceId = resource.toLowerCase();
      const value = direction === "↑" ? parseInt(amount) : -parseInt(amount);

      changes[resourceId] = value;
    }
  });

  return changes;
}

/**
 * Apply card effects to market resources
 */
export function applyCardEffect(effect, currentRes) {
  const updatedRes = { ...currentRes };
  const changes = parseCardEffect(effect);

  Object.entries(changes).forEach(([resourceId, delta]) => {
    if (updatedRes[resourceId]) {
      updatedRes[resourceId] = {
        ...updatedRes[resourceId],
        amount: Math.max(0, (updatedRes[resourceId].amount || 0) + delta),
      };
    }
  });

  return updatedRes;
}

/**
 * Get a random element from an array
 */
export function getRandomElement(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get effect description in Turkish
 */
export function getEffectDescription(effect) {
  if (!effect) return "";

  const turkishMap = {
    status: "STATÜ",
    labor: "İŞÇÜ",
    food: "YİYECEK",
    soul: "RUH",
    waste: "ATIK",
    energy: "ENERJİ",
    data: "VERİ",
  };

  const changes = parseCardEffect(effect);
  const descriptions = [];

  Object.entries(changes).forEach(([resource, delta]) => {
    const resourceName = turkishMap[resource] || resource.toUpperCase();
    const sign = delta > 0 ? "+" : "";
    descriptions.push(`${resourceName} ${sign}${delta}`);
  });

  return descriptions.join(", ");
}
