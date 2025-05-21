function getDelayForTimeframe(timeframe) {
  switch (timeframe) {
    case "12h":
      return 5 * 60 * 1000; // 5 minutes
    case "D":
      return 10 * 60 * 1000; // 10 minutes
    default:
      return 0;
  }
}

module.exports = { getDelayForTimeframe };
