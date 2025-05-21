// app/initialize-app.js
const express = require("express");
const cors = require("cors");

const coinsRouter = require("../coins/routes/coins.router.js");
//const oiRouter = require("../routers/oi.router.js");
const klineRouter = require("../kline/routes/kline.router.js");
const generalRouter = require("../routers/general.router.js");
const colorsRouter = require("../routers/colors.router.js");
//const frRouter = require("../routers/fr.router.js");

const ServantsConfigOperator = require("../functions/global/servants/servants-config.js");

async function initializeApp() {
  const allowedOrigins = ServantsConfigOperator.getConfig().allowedOrigins;

  if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) {
    throw new Error("No valid allowed origins found");
  }

  const app = express();
  app.use(express.json());
  app.use(cors({ origin: allowedOrigins }));

  app.use("/api", coinsRouter);
  //app.use("/api", oiRouter);
  app.use("/api", generalRouter);
  app.use("/api", colorsRouter);
  //app.use("/api", frRouter);
  app.use("/api", klineRouter);

  return app;
}

module.exports = { initializeApp };
