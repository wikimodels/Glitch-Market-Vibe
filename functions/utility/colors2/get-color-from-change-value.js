const { interpolateColor } = require("./interpolate-color.js");

function getColorFromChangeValue(
  value,
  min,
  max,
  negativeColor = "#8B0000",
  neutralColor = "#ffffff",
  positiveColor = "#006400"
) {
  const absMax = Math.max(Math.abs(min), Math.abs(max));
  const clamped = Math.max(-absMax, Math.min(absMax, value));
  const normalized = (clamped + absMax) / (2 * absMax); // 0 to 1

  return clamped < 0
    ? interpolateColor(negativeColor, neutralColor, normalized * 2)
    : interpolateColor(neutralColor, positiveColor, (normalized - 0.5) * 2);
}

module.exports = { getColorFromChangeValue };
