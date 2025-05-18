// routes/coins.router.js
const express = require("express"); // Import Express :contentReference[oaicite:2]{index=2}
const {
  getFundingRateDataController,
} = require("../controllers/fr.controller");

const {
  refreshFundingRateStoreController,
} = require("../controllers/fr.controller");

const router = express.Router();
router.get("/fr", getFundingRateDataController);
router.get("/fr/refresh", refreshFundingRateStoreController);

module.exports = router;
