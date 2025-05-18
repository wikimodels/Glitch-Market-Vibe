// functions/utility/validate-request-params.js

function validateRequestParams(query) {
  const supported = [
    "1m",
    "5m",
    "15m",
    "30m",
    "1h",
    "4h",
    "6h",
    "8h",
    "12h",
    "D",
  ];
  const timeframe = query.timeframe || "4h";
  const limit = parseInt(query.limit, 10) || 52;

  if (!supported.includes(timeframe)) {
    const err = new Error(
      `Invalid timeframe. Supported: ${supported.join(", ")}`
    );
    err.status = 400;
    throw err;
  }

  if (isNaN(limit) || limit < 1 || limit > 1000) {
    const err = new Error("Invalid limit. Must be between 1 and 1000.");
    err.status = 400;
    throw err;
  }

  return { timeframe, limit };
}

module.exports = { validateRequestParams };
