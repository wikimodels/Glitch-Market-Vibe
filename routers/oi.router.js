// routes/coins.router.js
const express = require("express"); // Import Express :contentReference[oaicite:2]{index=2}
const {
  getOpenInterestDataController,
} = require("../controllers/oi.controller");

const {
  refreshOpenInterestStoreController,
} = require("../controllers/oi.controller");

const router = express.Router();
router.get("/oi", getOpenInterestDataController);
router.get("/oi/refresh", refreshOpenInterestStoreController);

module.exports = router;
