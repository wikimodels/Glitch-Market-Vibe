const {
  initializeServantsConfig,
} = require("../app/initialize-servants-config.js");

async function sendSelfPong(_req, res, next) {
  try {
    const data = "Pong";
    return res.status(200).json({ data });
  } catch (err) {
    // 4) On error, reset cache to avoid stale data
    console.error("Error sendind self ping:", err);
    // Delegate error handling to Express
    return next(err);
  }
}

async function refreshServantsConfigController(_req, res, next) {
  try {
    await initializeServantsConfig();
    const data = "Servants Config reloaded";
    return res.status(200).json({ data });
  } catch (err) {
    // 4) On error, reset cache to avoid stale data
    console.error("Error sendind self ping:", err);
    // Delegate error handling to Express
    return next(err);
  }
}

module.exports = {
  sendSelfPong,
  refreshServantsConfigController,
};
