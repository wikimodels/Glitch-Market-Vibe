// routes/coins.router.js
const express = require("express");
const {
  refreshCoinsCacheController,
} = require("../controllers/coins.controller");

const router = express.Router();
router.get("/coins/refresh", refreshCoinsCacheController);

module.exports = router;
