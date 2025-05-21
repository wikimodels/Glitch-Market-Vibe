const {
  getBinanceDominantCache,
} = require("./coins/functions/coins-service.js");

const {
  initializeServantsConfig,
} = require("./app/initialize-servants-config.js");
const { initializeCoinsCache } = require("./coins/functions/coins-service.js");

async function shit() {
  try {
    await initializeServantsConfig();
    await initializeCoinsCache();
    const { binancePerps, bybitPerps, binanceSpot, bybitSpot } =
      getBinanceDominantCache();
    console.log("binancePerp", binancePerps.length);
    console.log("bybitPerp", bybitPerps.length);
    console.log("binanceSpot", binanceSpot.length);
    console.log("bybitSpot", bybitSpot.length);
  } catch (err) {
    console.error("Error fetching kline data:", err);
  }
}

shit();
