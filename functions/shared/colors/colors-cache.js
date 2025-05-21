// oiCache.js
const NodeCache = require("node-cache");

const colorsCache = new NodeCache({ stdTTL: 0 });

const colors = {
  closePriceMin: "#90EE90", // Light Green
  closePriceMax: "#006400", // Dark Green
  closePriceChangeMin: "#8B0000", // Dark Red
  closePriceChangeMax: "#006400", // Dark Green
  buyerRatioMin: "#90EE90", // Light Green
  buyerRatioMax: "#006400", // Dark Green
  buyerRatioChangeMin: "#8B0000", // Dark Red
  buyerRatioChangeMax: "#006400", // Dark Green
  quoteVolumeMin: "#90EE90", // Light Green
  quoteVolumeMax: "#006400", // Dark Green
  quoteVolumeChangeMin: "#8B0000", // Dark Red
  quoteVolumeChangeMax: "#006400", // Dark Green
  perpSpotDiffMin: "#90EE90", // Light Green
  perpSpotDiffMax: "#006400", // Dark Green
  volumeDeltaMin: "#90EE90", // Light Green
  volumeDeltaMax: "#006400", // Dark Green
  volumeDeltaChangeMin: "#8B0000", // Dark Red
  volumeDeltaChangeMax: "#006400", // Dark Green
  openInterestMin: "#90EE90", // Light Green
  openInterestMax: "#006400", // Dark Green
  openInterestChangeMin: "#8B0000", // Dark Red
  openInterestChangeMax: "#006400", // Dark Green
  fundingRateMin: "#90EE90", // Light Green
  fundingRateMax: "#006400", // Dark Green
  fundingRateChangeMin: "#8B0000", // Dark Red
  fundingRateChangeMax: "#006400", // Dark Green
};

function setInitialColors() {
  if (!colorsCache.get("colors")) {
    colorsCache.set("colors", { ...colors });
    console.log("🌈 [Colors Cache] Initial colors → set in cache...");
  } else {
    console.log("[Cache] Colors already exist in cache");
  }
}

function setColorsCache(data) {
  colorsCache.set("colors", data);
}

function getColorsCache() {
  return colorsCache.get("colors") ?? colors;
}

function resetColorsCache() {
  colorsCache.flushAll();
}

module.exports = {
  setColorsCache,
  getColorsCache,
  resetColorsCache,
  setInitialColors,
};
