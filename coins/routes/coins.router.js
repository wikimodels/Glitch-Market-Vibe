// routes/coins.router.js
const express = require("express");
const { getCoinsController } = require("../controllers/coins.controller");
const {
  getFailedSpotCoinsController,
} = require("../controllers/coins.controller");
const {
  getFailedPerpCoinsController,
} = require("../controllers/coins.controller");

const router = express.Router();
router.get("/coins", getCoinsController);
router.get("/coins/failed/spot", getFailedSpotCoinsController);
router.get("/coins/failed/perp", getFailedPerpCoinsController);
module.exports = router;
