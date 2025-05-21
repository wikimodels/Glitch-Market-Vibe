const chroma = require("chroma-js");

// Дивергирующая шкала с явным доменом
function getColorFromValue(
  value,
  startColor = "#004b23",
  endColor = "#00ff00"
) {
  return chroma.scale([startColor, endColor]).mode("lab")(value).hex();
}

module.exports = { getColorFromValue };
