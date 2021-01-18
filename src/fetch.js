const wait = require("waait");

const { logInfo, logError, logWarning } = require("./log");

const DELAY_NETWORK_ERROR_RETRY_MILLIS = 5000;
const MAX_RETRY_COUNT = 3;
const WEB_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36";

const fetch = async (client, url, retryCount = 0) => {
  try {
    const response = await client(url, {
      headers: {
        "user-agent": WEB_USER_AGENT,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message.includes("tiktok.com/404")) {
      logError(
        `handleFetchLeads - fetch, 404 error for url ${url}`
      );
      return null;
    }

    if (
      ((error.code &&
        (error.code === "ECONNRESET" ||
          error.code === "ETIMEDOUT" ||
          error.code === "ENOTFOUND" ||
          error.code === "TimeoutError")) ||
        error.name === "RequestError") &&
      retryCount < MAX_RETRY_COUNT
    ) {
      logWarning(
        `handleRequestError - network error, url: ${url}, ${error.stack}`
      );
      await wait(DELAY_NETWORK_ERROR_RETRY_MILLIS);
      return fetch(client, url, retryCount + 1);
    }

    logError(
      `Error handleFetchLeads - fetch ${error.stack}`
    );
    return null;
  }
};

module.exports = { fetch };
