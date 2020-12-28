const wait = require("waait");

const { fetchSignedURL } = require("./fetchSignedURL");
const { logInfo, logError, logWarning } = require("./log");

const URL_EXCL_SIG = `https://www.tiktok.com/node/share/user/@USERNAME?user_agent=USER_AGENT&validUniqueId=USERNAME`;
const DELAY_NETWORK_ERROR_RETRY_MILLIS = 5000;
const MAX_RETRY_COUNT = 3;
const WEB_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36";

const fetchWebUserTktkSigRaw = async (client, signedURL, retryCount = 0) => {
  try {
    const response = await client.get({
      uri: signedURL,
      // so it resolves with full response not just body
      resolveWithFullResponse: true,
      headers: {
        "user-agent": WEB_USER_AGENT,
      },
    });

    const data = JSON.parse(response.body);

    if (data && data.userInfo && data.userInfo.user) return data.userInfo;

    // statusCode returns 0 on success
    // statusCode returns -1 when missing signature
    // statusCode returns 10202 when user does not exist
    // statusCode returns 404 on page error (e.g. faulty URL)

    if (data.statusCode !== 0 || data.statusCode === 10202) {
      await logError(
        `handleFetchLeads - fetchWebUserTktkSigRaw, no data for ${signedURL}, statusCode: ${data.statusCode}`
      );
      return null;
    }
  } catch (error) {
    if (error.message.includes("tiktok.com/404")) {
      await logError(
        `handleFetchLeads - fetchWebUserTktkSigRaw, 404 error for url ${signedURL}`
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
      await logWarning(
        `handleRequestError - network error, url: ${signedURL}, ${error.stack}`
      );
      await wait(DELAY_NETWORK_ERROR_RETRY_MILLIS);
      return fetchWebUserTktkSigRaw(client, signedURL, retryCount + 1);
    }

    await logError(
      `Error handleFetchLeads - fetchWebUserTktkSigRaw ${error.stack}`
    );
    return null;
  }

  await logWarning(
    `handleFetchLeads - fetchWebUserTktkSigRaw, user does not exist for ${signedURL}`
  );
  return null;
};

const fetchWebUser = async (client, username) => {
  // NOTE, REMEMBER LOCAL SERVER NEEDS TO BE RUNNING
  try {
    const URLExclSig = URL_EXCL_SIG.replace(
      /USERNAME/g,
      encodeURIComponent(username)
    ).replace("USER_AGENT", encodeURIComponent(WEB_USER_AGENT));

    const signedURL = await fetchSignedURL(URLExclSig);

    if (!signedURL) {
      await logError(
        `handleFetchLeads - fetchWebUser no signedURL, return null`
      );
      return null;
    }

    await logInfo(`handleFetchLeads - fetchWebUser signed URL ${signedURL}`);
    const webTagInfoRaw = await fetchWebUserTktkSigRaw(client, signedURL);

    return webTagInfoRaw;
  } catch (error) {
    await logError(`Error handleFetchLeads - fetchWebUser - ${error.stack}`);
    return {};
  }
};

module.exports = { fetchWebUser };
