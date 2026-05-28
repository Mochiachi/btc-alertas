// =====================================
// SCHEDULER — EXECUTA RELATÓRIO SEMANAL
// Segunda-feira às 08:00
// =====================================

const cron = require("node-cron");
const { sendWeeklyReport } = require("./weeklyReport");
const { log } = require("../services/logger");

// Executa todas as segundas às 08:00
// Formato CRON: "minuto hora diaMes mes diaSemana"
cron.schedule("0 8 * * 1", () => {
    log("📅 Executando relatório semanal (Segunda 08:00)...");
    sendWeeklyReport();
});

