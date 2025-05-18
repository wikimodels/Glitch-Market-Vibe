const dayjs = require("dayjs");
const ru = require("dayjs/locale/ru");
dayjs.locale(ru);

/**
 * Преобразует Unix-время в ISO-формат
 * @param {number} unixTimestamp - Время в миллисекундах
 * @returns {string} - ISO-строка (UTC)
 */
function UnixToISO(unixTimestamp) {
  return dayjs(unixTimestamp).toISOString();
}

/**
 * Преобразует Unix-время в формат "YYYY-MM-DD HH:mm:ss"
 * @param {number} unixTimestamp - Время в миллисекундах
 * @returns {string} - Форматированное время
 */
function UnixToTime(unixTimestamp) {
  return dayjs(unixTimestamp).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * Преобразует Unix-время в русский формат с названиями дней и месяцев
 * @param {number} unixTimestamp - Время в миллисекундах
 * @returns {string} - Пример: "пт, 1 янв 2024 00:00:00"
 */
function UnixToNamedTimeRu(unixTimestamp) {
  const time = dayjs(unixTimestamp).locale("ru");
  return time.format("ddd, D MMM YYYY HH:mm:ss");
}

// Экспорт функций
module.exports = {
  UnixToISO,
  UnixToTime,
  UnixToNamedTimeRu,
};
