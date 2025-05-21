const {
  getColorFromChangeValue,
} = require("../shared/colors/get-color-from-change-value.js");

const {
  getColorFromValue,
} = require("../shared/colors/get-color-from-value.js");
const { getColorsCache } = require("../shared/colors/colors-cache.js");

/**
 * Normalize funding rate data to support consistent coloring and display.
 */
function normalizeFundingRateData(marketDataArray) {
  const colors = getColorsCache();

  return marketDataArray.map((coinData) => {
    const data = coinData.data;

    // Extract funding rates and changes
    const fundingRates = data.map((item) => item.fundingRate ?? 0);
    const fundingRateChanges = data.map((item) => item.fundingRateChange ?? 0);

    // Handle edge case: uniform funding rate
    const frMin = Math.min(...fundingRates);
    const frMax = Math.max(...fundingRates);
    const frRange = frMax - frMin;
    const frUniform = frRange === 0;

    // Use robust domain for change values to prevent distortion from outliers
    const frChangeMin = Math.min(...fundingRateChanges);
    const frChangeMax = Math.max(...fundingRateChanges);

    // Optional: Clip extreme values to avoid skewing the scale too much
    const absMaxChange = Math.max(Math.abs(frChangeMin), Math.abs(frChangeMax));
    const clippedMin = -absMaxChange;
    const clippedMax = absMaxChange;

    // Map each item
    const updatedData = data.map((item) => {
      const fundingRate = item.fundingRate ?? 0;
      const fundingRateChange = item.fundingRateChange ?? 0;

      // Normalize funding rate [0..1]
      const normalizedFr = frUniform ? 1 : (fundingRate - frMin) / frRange;

      // Get colors based on normalized value or diverging change
      const frColor = getColorFromValue(
        normalizedFr,
        colors.fundingRateMin,
        colors.fundingRateMax
      );
      const frChangeColor = getColorFromChangeValue(
        fundingRateChange,
        clippedMin,
        clippedMax,
        colors.fundingRateChangeMin,
        colors.fundingRateChangeMax
      );

      return {
        ...item,
        normalizedFundingRate: Number(normalizedFr.toFixed(2)),
        colors: {
          ...(item.colors || {}),
          fundingRate: frColor,
          fundingRateChange: frChangeColor,
        },
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}

module.exports = { normalizeFundingRateData };
