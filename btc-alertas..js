// =============================
// SISTEMA DE ALERTAS (NOVA VERSÃO COMPLETA)
// =============================

const signals = require("./signals/signals");
const { sendTelegram } = require("./telegram");
const { log } = require("./logger");

let capitalOportunidades = 500; // o teu capital inicial
let alertState = {}; // evita alertas duplicados

function processAlerts(market) {
    const {
        price,
        ath,
        acimaATH,
        desconto,
        change24h,
        MM200_semanal,
        tocarMM100,
        RSI,
        fearGreed,
        funding,
        divergenciaBullish,
        divergenciaBearish,
        bollingerInferior,
        perdeuEMA21,
        OI_sobe_preco_cai
    } = market;

    // 1) Filtrar sinais ativos
    const ativos = signals.filter(sig => sig.check(market));

    if (ativos.length === 0) return; // sem sinais → sem alertas

    // 2) Ordenar por prioridade (1 = mais forte)
    ativos.sort((a, b) => a.priority - b.priority);

    // 3) Escolher o sinal mais forte
    const sinal = ativos[0];

    // Evitar alertas repetidos
    if (alertState[sinal.name]) return;
    alertState[sinal.name] = true;

    // 4) Calcular valor em euros
    const euros = sinal.type === "compra"
        ? capitalOportunidades * sinal.percent
        : market.posicaoBTC * sinal.percent * price;

    // 5) Converter euros → BTC → sats
    const btc = euros / price;
    const sats = Math.round(btc * 100_000_000);

    // 6) Atualizar capital
    if (sinal.type === "compra") {
        capitalOportunidades -= euros;
    }

    // 7) Criar mensagem
    const msg = `
🔥 SINAL DETETADO (${sinal.type.toUpperCase()})
Nome: ${sinal.name}
Preço BTC: €${price.toLocaleString()}
Percentagem: ${(sinal.percent * 100).toFixed(1)}%
Valor: €${euros.toFixed(2)}
Quantidade: ${btc.toFixed(6)} BTC (${sats} sats)
Capital restante: €${capitalOportunidades.toFixed(2)}
`;

    // 8) Enviar alerta
    sendTelegram(msg);
    log(msg);
}

module.exports = { processAlerts };
