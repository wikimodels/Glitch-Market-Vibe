const { getDelayForTimeframe } = require("./get-delay-for-timeframe.js");

function runWithOptionalDelay(timeframe, fn) {
  const delay = getDelayForTimeframe(timeframe);
  if (delay > 0) {
    setTimeout(fn, delay);
  } else {
    fn();
  }
}

module.exports = { runWithOptionalDelay };
