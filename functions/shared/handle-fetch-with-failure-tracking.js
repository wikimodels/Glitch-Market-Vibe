async function handleFetchWithFailureTracking(
  fetchFn,
  coins,
  timeframe,
  limit,
  setFailedSymbolsFn,
  coinType,
  exchange
) {
  const results = await fetchFn(coins, timeframe, limit);

  const failedSymbols = [];
  const succeeded = [];

  for (const result of results) {
    if (!result.data || result.data.length === 0) {
      failedSymbols.push(result.symbol);
    } else {
      succeeded.push(result);
    }
  }

  // Cache failed symbols
  if (setFailedSymbolsFn && failedSymbols.length > 0) {
    setFailedSymbolsFn(exchange, coinType, failedSymbols);
  }

  return succeeded.map((result) => result.data);
}

module.exports = { handleFetchWithFailureTracking };
