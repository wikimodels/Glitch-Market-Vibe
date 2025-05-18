const { initializeCoinsStore } = require("./app/initialize-coins-store.js");
const { getCoinsFromCache } = require("./functions/coins/coins-service.js");
const {
  fetchBybitSpotKlines,
} = require("./functions/bybit/fetch-bybit-spot-klines.js");
const {
  noBybitSpotData,
} = require("./functions/utility/no-data/no-bybit-spot-data.js");
const {
  noBinanceSpotData,
} = require("./functions/utility/no-data/no-binance-spot-data.js");
const {
  initializeServantsConfig,
} = require("./app/initialize-servants-config");
const {
  addFailedSpotSymbols,
  getFailedSpotSymbols,
} = require("./functions/symbols/failed-bybit-sport-symbols.js");

async function main() {
  await initializeServantsConfig();
  await initializeCoinsStore();
  const coins = getCoinsFromCache();
  const bybitCoins = coins.filter((c) => c?.exchanges?.includes?.("Bybit"));

  const res = await fetchBybitSpotKlines(bybitCoins, "1h", 1);
  const success = res.filter((r) => r.success);
  const failed = res.filter((r) => !r.success);
  //   console.log(
  //     "Failed:",
  //     failed.map((f) => f.symbol)
  //   );
  //   console.log(
  //     "Success:",
  //     success.map((s) => s.data.symbol)
  //   );
  addFailedSpotSymbols(failed.map((f) => f.symbol));
  const failedSymbols = getFailedSpotSymbols();
  console.log("Failed:", failedSymbols.length);
}

main();
