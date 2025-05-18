// jobs/oi.js
const { CronJob } = require("cron");
const { fetchOpenInterestData } = require("../functions/oi/fetch-oi-data");
const { setOICache } = require("../functions/oi/oi-cache");
const { UnixToNamedTimeRu } = require("../functions/utility/time-converter");

const limit = 52;

async function refresh(timeframe) {
  try {
    const data = await fetchOpenInterestData(timeframe, limit);
    setOICache(timeframe, data);
    console.log(
      `✅ [${UnixToNamedTimeRu(Date.now())}] Updated OI cache for ${timeframe}`
    );
  } catch (err) {
    console.error(
      `❌ [${UnixToNamedTimeRu(Date.now())}] Error for ${timeframe}:`,
      err.message
    );
  }
}

function scheduleJob(cronExpr, timeframe) {
  const job = new CronJob(
    cronExpr,
    () => refresh(timeframe),
    null,
    false,
    "Europe/Moscow" // timezone handled here
  );
  job.start();
  console.log(`⏳ Scheduled OI ${timeframe} job...`);
}

function scheduleAllOiJobs() {
  // Every hour at :00 Moscow time → runs 00:00,01:00,…23:00 UTC+3
  scheduleJob("0 0 * * * *", "1h");

  // Every 4h at 00,04,08,12,16,20 hours Moscow time
  scheduleJob("0 0 3,7,11,15,19,23 * * *", "4h");

  // Every 12h at 00 and 12 Moscow time
  scheduleJob("0 0 3,15 * * *", "12h");

  // Daily at 03:00 Moscow time
  scheduleJob("0 0 3 * * *", "D");
}

module.exports = {
  scheduleAllOiJobs,
};
