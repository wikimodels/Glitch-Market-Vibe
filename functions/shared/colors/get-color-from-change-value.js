function getColorFromChangeValue(value, min, max) {
  const MAX_SCALE = 500;
  const MAX_CHANNEL_INTENSITY = 180; // darkest green/red limit

  const absMax = Math.max(Math.abs(min), Math.abs(max));
  const scale = Math.min(absMax, MAX_SCALE);
  const clampedValue = Math.max(-scale, Math.min(value, scale));

  const ZERO_THRESHOLD = 0.01;
  if (Math.abs(clampedValue) < ZERO_THRESHOLD) {
    return "rgb(255, 255, 255)";
  }

  const normalized = Math.pow(Math.abs(clampedValue) / scale, 0.5);
  const intensity = Math.round(normalized * MAX_CHANNEL_INTENSITY); // capped at 200

  let r = 255,
    g = 255,
    b = 255;

  if (clampedValue < 0) {
    // Red: dark red = full red minus capped green/blue
    g = 255 - intensity;
    b = 255 - intensity;
  } else {
    // Green: dark green = full green minus capped red/blue
    r = 255 - intensity;
    b = 255 - intensity;
  }

  return `rgb(${r}, ${g}, ${b})`;
}

module.exports = { getColorFromChangeValue };
