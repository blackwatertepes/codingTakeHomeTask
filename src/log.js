const chalk = require("chalk");

const logDebug = (data) => {
  console.debug(chalk.cyan("logDebug", data));
};

const logError = (data) => {
  console.error(chalk.red("logError", data));
};

const logInfo = (data) => {
  console.info("logInfo", data);
};

const logWarning = (data) => {
  console.warn(chalk.yellow("logWarning", data));
};

module.exports = {
  logDebug,
  logError,
  logInfo,
  logWarning,
};
