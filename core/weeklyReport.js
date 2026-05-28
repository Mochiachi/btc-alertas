const { sendTelegram } = require("../services/telegram");
const { log } = require("../services/logger");

let weeklyData = {
    startPrice: null,
    endPrice: null,
    high: -Infinity,
    low: Infinity,
    fearGreedValues: [],
    signalsTriggered: [],
    satsAccumulated: 0,
    eurosInvestidos: 0,
    capitalRestante: 500
};

// Atualizar dados semanais sempre que há update de mercado
function updateWeeklyData(market, capitalRestante) {
    const { price, fearGreed } = market;

    weeklyData.capitalRestante = capitalRestante;

    if (weeklyData.startPrice === null) {
        weeklyData.startPrice = price;
    }

    weeklyData.endPrice = price;

    if (price > weeklyData.high) weeklyData.high = price;
    if (price < weeklyData.low) weeklyData.low = price;

    weeklyData.fearGreedValues.push(Number(fearGreed));
}

// Registar sinais disparados
function registerSignal(signalName, sats, euros) {
    weeklyData.signalsTriggered.push(signalName);
    weeklyData.satsAccumulated += sats;
    weeklyData.eurosInvestidos += euros;
}

// Enviar relatório semanal
function sendWeeklyReport() {
    if (!weeklyData.startPrice || !weeklyData.endPrice) return;

    const variation = ((weeklyData.endPrice - weeklyData.startPrice) / weeklyData.startPrice) * 100;
    const fgAvg = weeklyData.fearGreedValues.length > 0
        ? (weeklyData.fearGreedValues.reduce((a, b) => a + b, 0) / weeklyData.fearGreedValues.length).toFixed(1)
        : "N/A";

    const msg = `
📊 *Relatório Semanal BTC*
Período: Segunda 08:00 → Segunda 08:00

💰 *Preço inicial:* €${weeklyData.startPrice.toLocaleString()}
💰 *Preço final:* €${weeklyData.endPrice.toLocaleString()}
📈 *Variação:* ${variation.toFixed(2)}%

🔼 *Máximo semanal:* €${weeklyData.high.toLocaleString()}
🔽 *Mínimo semanal:* €${weeklyData.low.toLocaleString()}

😨 *Fear & Greed médio:* ${fgAvg}

📌 *Sinais ativados esta semana:*
${weeklyData.signalsTriggered.length > 0 ? weeklyData.signalsTriggered.map(s => `- ${s}`).join("\n") : "Nenhum sinal"}

🟧 *Reforços aplicados:* €${weeklyData.eurosInvestidos.toFixed(2)}
🟦 *Sats acumulados:* ${weeklyData.satsAccumulated.toLocaleString()} sats

💼 *Capital restante:* €${weeklyData.capitalRestante.toFixed(2)}
`;

    sendTelegram(msg);
    log(msg);

    // Reset para a próxima semana
    weeklyData = {
        startPrice: null,
        endPrice: null,
        high: -Infinity,
        low: Infinity,
        fearGreedValues: [],
        signalsTriggered: [],
        satsAccumulated: 0,
        eurosInvestidos: 0,
        capitalRestante: weeklyData.capitalRestante
    };
}

module.exports = {
    updateWeeklyData,
    registerSignal,
    sendWeeklyReport
};
