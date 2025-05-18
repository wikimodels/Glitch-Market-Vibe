// jobs/oi.js
const { CronJob } = require("cron");
const { fetchKlineData } = require("../functions/kline/fetch-kline-data");
const { setKlineCache } = require("../functions/kline/kline-cache");
const { UnixToNamedTimeRu } = require("../functions/utility/time-converter");
const {
  runWithOptionalDelay,
} = require("../functions/utility/delay/run-with-optional-delay");

const limit = process.env.KLINE_LIMIT || 53;

async function refresh(timeframe) {
  const delay = getDelayForTimeframe(timeframe);
  if (delay > 0) {
    setTimeout(() => runRefresh(timeframe), delay);
  } else {
    await runRefresh(timeframe);
  }
}

async function refresh(timeframe) {
  runWithOptionalDelay(timeframe, async () => {
    try {
      const data = await fetchKlineData(timeframe, limit);
      setKlineCache(timeframe, data);
      console.log(
        `✅ [${UnixToNamedTimeRu(
          Date.now()
        )}] Updated Kline cache for ${timeframe}`
      );
    } catch (err) {
      console.error(
        `❌ [${UnixToNamedTimeRu(
          Date.now()
        )}] Error Kline Cache for ${timeframe}:`,
        err.message
      );
    }
  });
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
  console.log(`⏳ Scheduled Kline ${timeframe} job...`);
}

function scheduleAllKlineJobs() {
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
  scheduleAllKlineJobs,
};
