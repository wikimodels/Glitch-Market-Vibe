const {
  getFailedBybitSpotCoins,
} = require("../functions/failed-bybit-sport-coins");
const {
  getFailedBinanceSpotCoins,
} = require("../functions/failed-binance-sport-coins");
const {
  getFailedBybitPerpCoins,
} = require("../functions/failed-bybit-perp-coins");
const {
  getFailedBinancePerpCoins,
} = require("../functions/failed-binance-perp-coins");

const { getCoinsFromCache } = require("../functions/coins-cache");

async function getCoinsController(_req, res, next) {
  try {
    const coins = getCoinsFromCache();
    return res.status(200).json(coins);
  } catch (err) {
    console.error("Error fetching Coins:", err);
    return next(err);
  }
}

async function getFailedSpotCoinsController(_req, res, next) {
  try {
    const bybitSpot = getFailedBybitSpotCoins();
    const binanceSpot = getFailedBinanceSpotCoins();

    const data = {
      bybit: {
        count: bybitSpot.length,
        coins: [...bybitSpot],
      },
      binance: {
        count: binanceSpot.length,
        coins: [...binanceSpot],
      },
    };

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching failed spot Coins:", err);
    return next(err);
  }
}

async function getFailedPerpCoinsController(_req, res, next) {
  try {
    const bybitPerp = getFailedBybitPerpCoins();
    const binancePerp = getFailedBinancePerpCoins();

    const data = {
      bybit: {
        count: bybitPerp.length,
        coins: [...bybitPerp],
      },
      binance: {
        count: binancePerp.length,
        coins: [...binancePerp],
      },
    };

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching failed perp Coins:", err);
    return next(err);
  }
}

module.exports = {
  getFailedSpotCoinsController,
  getFailedPerpCoinsController,
  getCoinsController,
};
