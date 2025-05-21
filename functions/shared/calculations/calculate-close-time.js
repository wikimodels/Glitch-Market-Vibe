function calculateCloseTime(openTime, intervalMs) {
  return Number(openTime) + Number(intervalMs) - 1;
}

module.exports = { calculateCloseTime };
