// routes/coins.router.js
const express = require("express");
const { sendSelfPong } = require("../controllers/general.controller");

const router = express.Router();
router.get("/healthz", sendSelfPong);

module.exports = router;
