const axios = require("axios");
const { sendTelegram } = require("./services/telegram");
const { log } = require("./services/logger");
const { processAlerts } = require("./core/processAlerts");
const { updateWeeklyData } = require("./core/weeklyReport");
require("./core/scheduler"); // relatório semanal automático
const cron = require("node-cron");

// ATH do BTC em euros
const ATH = 69000;

// Buscar dados reais do BTC
async function getBTCData() {
    try {
        const priceURL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur";
        const fgURL = "https://api.alternative.me/fng/?limit=1";

        const [priceRes, fgRes] = await Promise.all([
            axios.get(priceURL),
            axios.get(fgURL)
        ]);

        const price = priceRes.data.bitcoin.eur;
        const fearGreed = Number(fgRes.data.data[0].value);

        const desconto = ((ATH - price) / ATH) * 100;
        const acimaATH = ((price - ATH) / ATH) * 100;

        return {
            preco: price,
            price,
            posicaoBTC: 0.1,
            desconto,
            acimaATH,
            RSI: 40, // valor fixo
            fearGreed,
            funding: -0.01,
            tocarMM100: false,
            MM200_semanal: 50000,
            divergenciaBullish: false,
            divergenciaBearish: false,
            bollingerInferior: false,
            perdeuEMA21: false,
            OI_sobe_preco_cai: false,
            euforia: false
        };

    } catch (err) {
        console.error("Erro ao obter dados:", err);
        return null;
    }
}

// LOOP PRINCIPAL — mas sem enviar preço
async function startBot() {
    log("🤖 Bot iniciado com sinais + relatório semanal + alerta diário!");

    setInterval(async () => {
        const market = await getBTCData();
        if (!market) return;

        // Atualiza relatório semanal
        updateWeeklyData(market, 500);

        // Processa sinais (só envia mensagem se houver sinal)
        processAlerts(market);

    }, 30_000); // verifica sinais a cada 30s
}

// ALERTA DIÁRIO ÀS 07:59
cron.schedule("59 7 * * *", async () => {
    const market = await getBTCData();
    if (!market) return;

    const msg = `🌅 *Bom dia Mkarlos!*\nPreço atual do Bitcoin: €${market.price.toLocaleString()}`;
    await sendTelegram(msg);
    log("Mensagem diária enviada.");
});

startBot();
