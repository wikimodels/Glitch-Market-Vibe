// configOperator.js

// 1. Load .env into process.env
require("dotenv").config(); // :contentReference[oaicite:0]{index=0}
const DopplerSDK = require("@dopplerhq/node-sdk").default;

/**
 * @typedef {Object} ServantsConfig
 * @property {string} tgUser
 * @property {string} tgTech
 * @property {string} tgBusiness
 * @property {string[]} allowedOrigins
 * @property {string} coinsApi
 * @property {string} coinsStoreApi
 * @property {string} mongoDb
 * @property {string} proxyMarketVibe
 * @property {string} projectName
 * @property {number} delayInMinutesShort
 * @property {number} delayInMinutesLong
 */

class ServantsConfigOperator {
  /** @type {ServantsConfigOperator|null} */
  static instance = null;
  /** @type {string|undefined} */
  static dopplerToken = process.env.SERVANTS_TOKEN;
  /** @type {ServantsConfig|null} */
  static config = null;

  // Private constructor enforces singleton
  constructor() {
    if (ServantsConfigOperator.instance) {
      throw new Error("Use getInstance(), not new.");
    }
  }

  /**
   * Returns the singleton instance
   * @returns {ServantsConfigOperator}
   */
  static getInstance() {
    if (!ServantsConfigOperator.instance) {
      ServantsConfigOperator.instance = new ServantsConfigOperator();
    }
    return ServantsConfigOperator.instance;
  }

  /**
   * Fetches secrets from Doppler and initializes in-memory config
   * @returns {Promise<void>}
   */
  static async initialize() {
    if (ServantsConfigOperator.config) {
      console("Configuration already initialized.");
      return;
    }
    if (!this.dopplerToken) {
      throw new Error("Missing SERVANTS_TOKEN in environment.");
    }

    try {
      const doppler = new DopplerSDK({ accessToken: this.dopplerToken });
      // 'servants' is the config name, 'prd' is the environment
      const response = await doppler.secrets.download("servants", "prd");
      const secrets = /** @type {{ [k: string]: string }} */ (response);

      ServantsConfigOperator.config = {
        tgUser: secrets.TG_USER,
        tgTech: secrets.TG_TECH,
        tgBusiness: secrets.TG_BUSINESS || "",
        allowedOrigins: JSON.parse(secrets.ALLOWED_ORIGINS),
        coinsApi: secrets.COINS || "",
        coinsStoreApi: secrets.COINS_STORE || "",
        mongoDb: secrets.MONGO_DB || "",
        proxyMarketVibe: secrets.PROXY_MARKET_VIBE || "",
        projectName: "Render-Market-Vibe",
        renderOiServer: secrets.RENDER_OI_SERVER || "",
        delayInMinutesShort: 5,
        delayInMinutesLong: 10,
      };

      console.log("✅ ServantsConfigOperator → initialized...");
    } catch (err) {
      console.error("Failed to initialize configuration:", err);
      throw err;
    }
  }

  /**
   * Returns the in-memory config, throws if uninitialized
   * @returns {ServantsConfig}
   */
  static getConfig() {
    if (!ServantsConfigOperator.config) {
      throw new Error(
        "Configuration not initialized; call initialize() first."
      );
    }
    return ServantsConfigOperator.config;
  }

  /**
   * Forces a reload of the config from Doppler
   * @returns {Promise<void>}
   */
  static async reloadConfig() {
    console.log("Reloading configuration...");
    ServantsConfigOperator.config = null;
    await ServantsConfigOperator.initialize();
    console.log("Configuration reloaded");
  }
}

module.exports = ServantsConfigOperator;
