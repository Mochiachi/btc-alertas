// signals/signals.js — CORRIGIDO E OTIMIZADO

const signals = [

  // -----------------------------
  // 🟩 SINAIS DE COMPRA (PRIORIDADE ALTA → BAIXA)
  // -----------------------------

  {
    name: "COMPRA_PREMIUM_DESCONTO50_FEAR20",
    type: "compra",
    priority: 1,
    percent: 0.30,
    check: (d) => d.desconto >= 50 && d.fearGreed <= 20
  },

  {
    name: "COMPRA_PREMIUM_MM200_DESCONTO50_70",
    type: "compra",
    priority: 2,
    percent: 0.25,
    check: (d) => d.price > d.MM200_semanal && d.desconto >= 50
  },

  {
    name: "COMPRA_PREMIUM_MM100_MM200",
    type: "compra",
    priority: 3,
    percent: 0.08,
    check: (d) => d.tocarMM100 === true && d.price > d.MM200_semanal
  },

  // --- Descontos do ATH ---
  {
    name: "COMPRA_DESCONTO70",
    type: "compra",
    priority: 4,
    percent: 0.30,
    check: (d) => d.desconto >= 70
  },

  {
    name: "COMPRA_DESCONTO60",
    type: "compra",
    priority: 5,
    percent: 0.25,
    check: (d) => d.desconto >= 60
  },

  {
    name: "COMPRA_DESCONTO50",
    type: "compra",
    priority: 6,
    percent: 0.20,
    check: (d) => d.desconto >= 50
  },

  {
    name: "COMPRA_DESCONTO40",
    type: "compra",
    priority: 7,
    percent: 0.12,
    check: (d) => d.desconto >= 40
  },

  {
    name: "COMPRA_DESCONTO30",
    type: "compra",
    priority: 8,
    percent: 0.10,
    check: (d) => d.desconto >= 30
  },

  // --- Tendência macro ---
  {
    name: "COMPRA_MM100_MENSAL",
    type: "compra",
    priority: 9,
    percent: 0.05,
    check: (d) => d.tocarMM100 === true
  },

  {
    name: "COMPRA_MM200_SEMANAL",
    type: "compra",
    priority: 10,
    percent: 0.03,
    check: (d) => d.price > d.MM200_semanal
  },

  // --- Sentimento ---
  {
    name: "COMPRA_FEAR20",
    type: "compra",
    priority: 11,
    percent: 0.10,
    check: (d) => d.fearGreed <= 20
  },

  // --- Técnicos ---
  {
    name: "COMPRA_DIVERGENCIA_BULLISH",
    type: "compra",
    priority: 12,
    percent: 0.08,
    check: (d) => d.divergenciaBullish === true
  },

  {
    name: "COMPRA_RSI30",
    type: "compra",
    priority: 13,
    percent: 0.05,
    check: (d) => d.RSI <= 30
  },

  {
    name: "COMPRA_BOLLINGER_INFERIOR",
    type: "compra",
    priority: 14,
    percent: 0.05,
    check: (d) => d.bollingerInferior === true
  },

  {
    name: "COMPRA_FUNDING_NEGATIVO",
    type: "compra",
    priority: 15,
    percent: 0.05,
    check: (d) => d.funding < 0
  },

  // -----------------------------
  // 🟥 SINAIS DE VENDA
  // -----------------------------

  {
    name: "VENDA_200_EUFORIA",
    type: "venda",
    priority: 1,
    percent: 0.40,
    check: (d) => d.acimaATH >= 200 && d.euforia === true
  },

  {
    name: "VENDA_100_RSI80",
    type: "venda",
    priority: 2,
    percent: 0.25,
    check: (d) => d.acimaATH >= 100 && d.RSI >= 80
  },

  {
    name: "VENDA_200",
    type: "venda",
    priority: 3,
    percent: 0.30,
    check: (d) => d.acimaATH >= 200
  },

  {
    name: "VENDA_100",
    type: "venda",
    priority: 4,
    percent: 0.20,
    check: (d) => d.acimaATH >= 100
  },

  {
    name: "VENDA_50",
    type: "venda",
    priority: 5,
    percent: 0.10,
    check: (d) => d.acimaATH >= 50
  },

  {
    name: "VENDA_RSI80",
    type: "venda",
    priority: 6,
    percent: 0.10,
    check: (d) => d.RSI >= 80
  },

  {
    name: "VENDA_DIVERGENCIA_BEARISH",
    type: "venda",
    priority: 7,
    percent: 0.10,
    check: (d) => d.divergenciaBearish === true
  },

  {
    name: "VENDA_EMA21_MENSAL",
    type: "venda",
    priority: 8,
    percent: 0.10,
    check: (d) => d.perdeuEMA21 === true
  },

  {
    name: "VENDA_MM200_SEMANAL",
    type: "venda",
    priority: 9,
    percent: 0.15,
    check: (d) => d.price < d.MM200_semanal
  },

  {
    name: "VENDA_FUNDING_POSITIVO",
    type: "venda",
    priority: 10,
    percent: 0.10,
    check: (d) => d.funding > 0.05
  },

  {
    name: "VENDA_OI_SOBE_PRECO_CAI",
    type: "venda",
    priority: 11,
    percent: 0.10,
    check: (d) => d.OI_sobe_preco_cai === true
  }

];

module.exports = signals;
