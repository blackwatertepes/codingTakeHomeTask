const chalk = require("chalk");

const logCritical = async (data) => {
  console.log(chalk.bgRed("logCritical", data));
};
const logDebug = async (data) => {
  console.log(chalk.cyan("logDebug", data));
};
const logError = async (data) => {
  console.log(chalk.red("logError", data));
};
const logInfo = async (data) => {
  console.log("logInfo", data);
};

const logWarning = async (data) => {
  console.log(chalk.yellow("logWarning", data));
};

module.exports = {
  logCritical,
  logDebug,
  logError,
  logInfo,
  logWarning,
};
