const signals = require("../signals/signals");
const { sendTelegram } = require("../services/telegram");
const { log } = require("../services/logger");

let capitalOportunidades = 500;
let alertState = {};

function processAlerts(market) {
    // Filtrar sinais ativos
    const ativos = signals.filter(sig => sig.check(market));
    if (ativos.length === 0) return; // sem sinais → não envia nada

    // Ordenar por prioridade
    ativos.sort((a, b) => a.priority - b.priority);

    // Sinal mais forte
    const sinal = ativos[0];

    // Evitar alertas repetidos
    if (alertState[sinal.name]) return;
    alertState[sinal.name] = true;

    // Calcular valor em euros
    const euros = sinal.type === "compra"
        ? capitalOportunidades * sinal.percent
        : market.posicaoBTC * sinal.percent * market.price;

    // Converter para BTC e sats
    const btc = euros / market.price;
    const sats = Math.round(btc * 100_000_000);

    // Atualizar capital
    if (sinal.type === "compra") {
        capitalOportunidades -= euros;
    }

    // Mensagem final
    const msg = `
🔥 *SINAL DETETADO* (${sinal.type.toUpperCase()})
Nome: ${sinal.name}
Preço BTC: €${market.price.toLocaleString()}
Percentagem: ${(sinal.percent * 100).toFixed(1)}%
Valor: €${euros.toFixed(2)}
Quantidade: ${btc.toFixed(6)} BTC (${sats} sats)
Capital restante: €${capitalOportunidades.toFixed(2)}
`;

    sendTelegram(msg);
    log(msg);
}

module.exports = { processAlerts };
