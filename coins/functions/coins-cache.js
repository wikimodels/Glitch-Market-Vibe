// cache.js
const NodeCache = require("node-cache");

// Initialize cache with no expiration (stdTTL: 0)
const coinsCache = new NodeCache({ stdTTL: 0 });

module.exports = coinsCache;
