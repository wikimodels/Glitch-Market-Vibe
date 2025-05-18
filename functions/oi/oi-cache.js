// oiCache.js
const NodeCache = require("node-cache");

const TTL = { "1h": 0, "4h": 0, "12h": 0, D: 0 };

const oiCaches = Object.fromEntries(
  Object.entries(TTL).map(([tf, ttl]) => [tf, new NodeCache({ stdTTL: 0 })])
);

const VALID = Object.keys(oiCaches);

function assertTimeframe(tf) {
  if (!oiCaches[tf])
    throw new Error(
      `Unsupported timeframe "${tf}". Supported: ${VALID.join(", ")}`
    );
}

function setOICache(tf, data) {
  assertTimeframe(tf);
  // use per-key TTL if desired: TTL[tf]
  oiCaches[tf].set("oiData", data, TTL[tf] || 0);
}

function getOICache(tf) {
  assertTimeframe(tf);
  return oiCaches[tf].get("oiData") ?? null;
}

function resetOICache(tf) {
  if (tf) {
    assertTimeframe(tf);
    oiCaches[tf].flushAll();
  } else {
    Object.values(oiCaches).forEach((c) => c.flushAll());
  }
}

module.exports = {
  VALID_TIMEFRAMES: VALID,
  setOICache,
  getOICache,
  resetOICache,
};
