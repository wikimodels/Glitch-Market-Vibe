const {
  getColorsCache,
  setColorsCache,
} = require("../functions/shared/colors/colors-cache.js");

// GET /api/colors → Returns current colors
async function getColorsController(_req, res) {
  try {
    const colors = getColorsCache();
    res.status(200).json(colors);
  } catch (err) {
    console.error("[GET /colors] Error:", err);
    res.status(500).json({ error: "Failed to get colors from cache" });
  }
}

// POST /api/colors → Updates the color object in cache
async function setColorsController(req, res) {
  try {
    const newColors = req.body;
    if (!newColors || typeof newColors !== "object") {
      return res.status(400).json({ error: "Invalid colors object" });
    }

    setColorsCache(newColors);
    res.status(200).json({ message: "Colors updated successfully" });
  } catch (err) {
    console.error("[POST /colors] Error:", err);
    res.status(500).json({ error: "Failed to update colors in cache" });
  }
}

module.exports = {
  getColorsController,
  setColorsController,
};
