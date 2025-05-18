// jobs/oi.js
const { CronJob } = require("cron");

const { UnixToNamedTimeRu } = require("../functions/utility/time-converter");
const { fetchFundingRateData } = require("../functions/fr/fetch-fr-data");
const { setFundingRateCache } = require("../functions/fr/fr-cache");

const limit = 52;

async function refresh() {
  try {
    const data = await fetchFundingRateData(limit);
    setFundingRateCache(data);
    console.log(`✅ [${UnixToNamedTimeRu(Date.now())}] Updated FR cache`);
  } catch (err) {
    console.error(
      `❌ [${UnixToNamedTimeRu(Date.now())}] Error for ${timeframe}:`,
      err.message
    );
  }
}

function scheduleJob(cronExpr) {
  const job = new CronJob(
    cronExpr,
    () => refresh(),
    null,
    false,
    "Europe/Moscow" // timezone handled here
  );
  job.start();
  console.log(`⏳ Scheduled FR job...`);
}

function scheduleAllFrJobs() {
  // Every hour at :00 Moscow time → runs 00:00,01:00,…23:00 UTC+3
  scheduleJob("0 0 */2 * * *");
}

module.exports = {
  scheduleAllFrJobs,
};
