// oiCache.js
const NodeCache = require("node-cache");

const TTL = { "1h": 0, "4h": 0, "12h": 0, D: 0 };

const klineCaches = Object.fromEntries(
  Object.entries(TTL).map(([tf, ttl]) => [tf, new NodeCache({ stdTTL: 0 })])
);

const VALID = Object.keys(klineCaches);

function assertTimeframe(tf) {
  if (!klineCaches[tf])
    throw new Error(
      `Unsupported timeframe "${tf}". Supported: ${VALID.join(", ")}`
    );
}

function setKlineCache(tf, data) {
  assertTimeframe(tf);
  // use per-key TTL if desired: TTL[tf]
  klineCaches[tf].set("oiData", data, TTL[tf] || 0);
}

function getKlineCache(tf) {
  assertTimeframe(tf);
  return klineCaches[tf].get("oiData") ?? null;
}

function resetKlineCache(tf) {
  if (tf) {
    assertTimeframe(tf);
    klineCaches[tf].flushAll();
  } else {
    Object.values(klineCaches).forEach((c) => c.flushAll());
  }
}

module.exports = {
  VALID_TIMEFRAMES: VALID,
  setKlineCache,
  getKlineCache,
  resetKlineCache,
};
