// Input validation & sanitization
export const validatePlayerName = (name) => {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "İsim gerekli" };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: "İsim en az 2 karakter olmalı" };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: "İsim max 20 karakter olabilir" };
  }

  // Sadece alfanumerik + underscore + space
  if (!/^[a-zA-Z0-9_\s]+$/.test(trimmed)) {
    return { valid: false, error: "İsim sadece harf, rakam, _ ve boşluk içerebilir" };
  }

  return { valid: true, value: trimmed.toUpperCase() };
};

export const validateAmount = (amount, type = "number") => {
  if (amount === null || amount === undefined) {
    return { valid: false, error: "Miktar gerekli" };
  }

  const num = Number(amount);
  if (isNaN(num)) {
    return { valid: false, error: "Geçersiz miktar" };
  }

  if (num < 0) {
    return { valid: false, error: "Miktar negatif olamaz" };
  }

  if (type === "muli" && num > 10000) {
    return { valid: false, error: "Çok büyük bir miktar" };
  }

  return { valid: true, value: num };
};

export const validatePrice = (price) => {
  const validation = validateAmount(price);
  if (!validation.valid) return validation;

  if (validation.value <= 0) {
    return { valid: false, error: "Fiyat 0 dan büyük olmalı" };
  }

  return { valid: true, value: parseFloat(price).toFixed(1) };
};

// XSS Protection - Sanitize HTML
export const sanitizeText = (text) => {
  if (!text || typeof text !== "string") return "";
  
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

// Notification message sanitization
export const createSafeNotif = (msg) => {
  const div = document.createElement("div");
  div.textContent = msg;
  return div.innerHTML;
};
