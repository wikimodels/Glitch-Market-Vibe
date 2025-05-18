const {
  validateRequestParams,
} = require("../functions/utility/validate-request-params.js");

const { getFundingRate } = require("../functions/fr/fr-cache.js");
const { initializeFundingRateStore } = require("../app/initialize-oi-store.js");

async function getFundingRateDataController(_req, res, next) {
  try {
    const data = getFundingRate();
    return res.status(200).json(data);
  } catch (err) {
    // 4) On error, reset cache to avoid stale data
    console.error("Error fetching Funding Rate:", err);
    // Delegate error handling to Express
    return next(err);
  }
}

async function refreshFundingRateStoreController(req, res, next) {
  try {
    const { limit } = validateRequestParams(req.query);

    await initializeFundingRateStore(limit);

    // 3) Return coins array as JSON
    return res.status(200).json({ message: "FR store refreshed" });
  } catch (err) {
    // 4) On error, reset cache to avoid stale data
    console.error("Error fetching funding rate:", err);
    // Delegate error handling to Express
    return next(err);
  }
}

module.exports = {
  getFundingRateDataController,
  refreshFundingRateStoreController,
};
