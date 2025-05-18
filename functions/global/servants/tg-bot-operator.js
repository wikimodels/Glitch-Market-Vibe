// telegramBotOperator.js

// 1. Install via: npm install node-telegram-bot-api
const TelegramBot = require("node-telegram-bot-api");

class TelegramBotOperator {
  /** @type {TelegramBot|null} */
  static techBot = null;
  /** @type {TelegramBot|null} */
  static businessBot = null;

  /**
   * Initialize both Telegram bots using polling.
   * @param {{ tgTech: string, tgBusiness: string }} config
   */
  static async initialize({ tgTech, tgBusiness }) {
    if (!tgTech || !tgBusiness) {
      throw new Error("Missing required bot tokens in configuration.");
    }

    // Create bots with polling enabled :contentReference[oaicite:1]{index=1}
    this.techBot = new TelegramBot(tgTech, { polling: true });
    this.businessBot = new TelegramBot(tgBusiness, { polling: true });

    console.log("✅ TelegramBotOperator → initialized...");
  }

  /**
   * @returns {TelegramBot}
   */
  static getTechBot() {
    if (!this.techBot) {
      throw new Error("Tech bot is not initialized. Call initialize() first.");
    }
    return this.techBot;
  }

  /**
   * @returns {TelegramBot}
   */
  static getBusinessBot() {
    if (!this.businessBot) {
      throw new Error(
        "Business bot is not initialized. Call initialize() first."
      );
    }
    return this.businessBot;
  }
}

module.exports = TelegramBotOperator;
