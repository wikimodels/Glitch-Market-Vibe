const {
  validateRequestParams,
} = require("../../functions/shared/validators/validate-request-params.js");

const { getKlineCache } = require("../functions/kline-cache.js");

const {
  initializeKlineStore,
} = require("../functions/initialize-kline-store.js");

async function getKlineDataController(req, res, next) {
  try {
    const { timeframe } = validateRequestParams(req.query);

    const data = getKlineCache(timeframe);

    // 3) Return coins array as JSON
    return res.status(200).json(data);
  } catch (err) {
    // 4) On error, reset cache to avoid stale data
    console.error("Error fetching kline data:", err);
    // Delegate error handling to Express
    return next(err);
  }
}

async function refreshKlineStoreController(req, res, next) {
  try {
    const { limit } = validateRequestParams(req.query);

    await initializeKlineStore(limit);

    // 3) Return coins array as JSON
    return res.status(200).json({ message: "OI store refreshed" });
  } catch (err) {
    // 4) On error, reset cache to avoid stale data
    console.error("Error fetching open interest:", err);
    // Delegate error handling to Express
    return next(err);
  }
}

module.exports = {
  getKlineDataController,
  refreshKlineStoreController,
};
