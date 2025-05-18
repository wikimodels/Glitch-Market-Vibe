function getBinanceKlineInterval(timeframe) {
  const timeframes = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "30m": "30m",
    "1h": "1h",
    "2h": "2h",
    "4h": "4h",
    "6h": "6h",
    "8h": "8h",
    "12h": "12h",
    D: "1d",
  };

  if (!(timeframe in timeframes)) {
    throw new Error(`Unsupported timeframe: ${timeframe}`);
  }

  return timeframes[timeframe];
}

module.exports = { getBinanceKlineInterval };
