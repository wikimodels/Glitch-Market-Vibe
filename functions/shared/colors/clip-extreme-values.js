// Clip extreme values to a reasonable range (e.g., ±5 standard deviations)
function clipExtremeValues(values) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values
      .map((val) => Math.pow(val - mean, 2))
      .reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const clippedMin = Math.max(-5 * stdDev, Math.min(...values));
  const clippedMax = Math.min(5 * stdDev, Math.max(...values));

  return [clippedMin, clippedMax];
}

module.exports = { clipExtremeValues };
