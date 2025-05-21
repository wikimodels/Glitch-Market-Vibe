const {
  getColorFromChangeValue,
} = require("../shared/colors/get-color-from-change-value.js");
const {
  getColorFromValue,
} = require("../shared/colors/get-color-from-value.js");
const { getColorsCache } = require("../shared/colors/colors-cache.js");

function normalizeOpenInterestData(marketDataArray) {
  const colors = getColorsCache();

  return marketDataArray.map((coinData) => {
    const { data } = coinData;

    // Skip if no data
    if (!data?.length) return coinData;

    // Extract values for normalization
    const openInterests = data.map((item) => item.openInterest ?? 0);
    const openInterestChanges = data.map(
      (item) => item.openInterestChange ?? 0
    );

    const oiMin = Math.min(...openInterests);
    const oiMax = Math.max(...openInterests);
    const oiRange = oiMax - oiMin || 1; // prevent division by 0

    const oiChangeMin = Math.min(...openInterestChanges);
    const oiChangeMax = Math.max(...openInterestChanges);

    const updatedData = data.map((item) => {
      const normalizedOi = (item.openInterest - oiMin) / oiRange;
      const oiColor = getColorFromValue(
        normalizedOi,
        colors.openInterestMin,
        colors.openInterestMax
      );
      const oiChangeColor = getColorFromChangeValue(
        item.openInterestChange,
        oiChangeMin,
        oiChangeMax,
        colors.openInterestChangeMin,
        colors.openInterestChangeMax
      );

      return {
        ...item,
        normalizedOpenInterest: Number(normalizedOi.toFixed(2)),
        colors: {
          ...item.colors,
          openInterest: oiColor,
          openInterestChange: oiChangeColor,
        },
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}

module.exports = { normalizeOpenInterestData };
