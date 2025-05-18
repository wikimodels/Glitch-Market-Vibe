const {
  validateRequestParams,
} = require("../functions/utility/validate-request-params");

const { getOICache } = require("../functions/oi/oi-cache");

const {
  initializeOpenInterestStore,
} = require("../app/initialize-oi-store.js");

async function getOpenInterestDataController(req, res, next) {
  try {
    const { timeframe } = validateRequestParams(req.query);

    const data = getOICache(timeframe);

    // 3) Return coins array as JSON
    return res.status(200).json(data);
  } catch (err) {
    // 4) On error, reset cache to avoid stale data
    console.error("Error fetching open interest:", err);
    // Delegate error handling to Express
    return next(err);
  }
}

async function refreshOpenInterestStoreController(req, res, next) {
  try {
    const { limit } = validateRequestParams(req.query);

    await initializeOpenInterestStore(limit);

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
  getOpenInterestDataController,
  refreshOpenInterestStoreController,
};
