const POLICY_CARDS = [
  { id: "p01", name: "Monopoly Yasası", effect: "Status ↑1, Labor ↓1" },
  { id: "p02", name: "Grev Yasağı", effect: "Labor ↓2" },
  { id: "p03", name: "Vergi Kaçakçılığı", effect: "Food ↓1, Waste ↑1" },
  { id: "p04", name: "Sübvansiyon Paketi", effect: "Energy ↑1" },
  { id: "p05", name: "Özelleştirme Dalgası", effect: "Status ↑2" },
  { id: "p06", name: "Dijital Tekel", effect: "Data ↑2" },
  { id: "p07", name: "Çevre Sertifikası", effect: "Waste ↓1" },
  { id: "p08", name: "Sosyal Güvence Kesintisi", effect: "Soul ↓1" },
  { id: "p09", name: "Mega Birleşme", effect: "Status ↑2, Data ↑1" },
  { id: "p10", name: "Enerji Deregülasyonu", effect: "Energy ↓1, Waste ↑1" },
  { id: "p11", name: "Gıda Müsaderesi", effect: "Food ↑1" },
  { id: "p12", name: "Veri Ticareti Yasası", effect: "Data ↑1, Soul ↓1" },
  { id: "p13", name: "Lüks Vergisi", effect: "Status ↓1" },
  { id: "p14", name: "Mesai Uzatma", effect: "Labor ↑2, Soul ↓1" },
  { id: "p15", name: "Sağlık Kesintisi", effect: "Food ↓1, Soul ↓1" },
  { id: "p16", name: "Yenilenebilir Teşvik", effect: "Energy ↑1" },
];

const EVENT_CARDS = [
  { id: "e01", name: "Ekonomik Kriz", effect: "Labor ↓1, Food ↓1" },
  { id: "e02", name: "Borsa Rallisi", effect: "Status ↑2" },
  { id: "e03", name: "Doğal Afet", effect: "Food ↓2, Energy ↓1" },
  { id: "e04", name: "Teknoloji Patlaması", effect: "Data ↑2" },
  { id: "e05", name: "İşçi İsyanı", effect: "Labor ↑2, Status ↓1" },
  { id: "e06", name: "Küresel Salgın", effect: "Food ↓1, Soul ↓2" },
  { id: "e07", name: "Enerji Krizi", effect: "Energy ↓2" },
  { id: "e08", name: "Veri İhlali", effect: "Data ↓2, Status ↓1" },
  { id: "e09", name: "Kıtlık", effect: "Food ↓2" },
  { id: "e10", name: "Sosyal Patlama", effect: "Soul ↑2, Status ↑1" },
  { id: "e11", name: "Çevre Felaketi", effect: "Waste ↑3" },
  { id: "e12", name: "Yapay Zeka Devrimi", effect: "Data ↑3, Labor ↓2" },
  { id: "e13", name: "Döviz Krizi", effect: "Status ↓1, Soul ↓1" },
  { id: "e14", name: "Mega Skandal", effect: "Status ↓2" },
  { id: "e15", name: "Verimlilik Patlaması", effect: "Labor ↑2" },
  { id: "e16", name: "Piyasa Çöküşü", effect: "Labor ↓1, Food ↓1, Status ↓1" },
];

export const ALL_CARDS = [
  ...POLICY_CARDS.map(c => ({ ...c, type: "policy" })),
  ...EVENT_CARDS.map(c => ({ ...c, type: "event" })),
];

export { POLICY_CARDS, EVENT_CARDS };
