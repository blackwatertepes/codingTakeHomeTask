const wait = require("waait");

const { signUrl } = require("./signUrl");
const { fetch } = require("./fetch");
const { logInfo, logError, logWarning } = require("./log");

const WEB_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36";

const urlExclSig = (username) => {
  return `https://www.tiktok.com/node/share/user/@${encodeURIComponent(username)}?user_agent=${encodeURIComponent(WEB_USER_AGENT)}&validUniqueId=USERNAME`
}

const fetchWebUserTktkSigRaw = async (client, signedURL) => {
  const data = await fetch(client, signedURL);

  if (data && data.userInfo && data.userInfo.user) return data.userInfo;

  // statusCode returns 0 on success
  // statusCode returns -1 when missing signature
  // statusCode returns 10202 when user does not exist
  // statusCode returns 404 on page error (e.g. faulty URL)

  if (data.statusCode !== 0 || data.statusCode === 10202) {
    logError(
      `handleFetchLeads - fetchWebUserTktkSigRaw, no data for ${signedURL}, statusCode: ${data.statusCode}`
    );
    return null;
  }

  logWarning(
    `handleFetchLeads - fetchWebUserTktkSigRaw, user does not exist for ${signedURL}`
  );

  return null;
};

const fetchWebUser = async (client, username) => {
  try {
    const signedURL = await signUrl(urlExclSig(username));

    if (!signedURL) {
      logError(
        `handleFetchLeads - fetchWebUser no signedURL, return null`
      );
      return null;
    }

    logInfo(`handleFetchLeads - fetchWebUser signed URL ${signedURL}`);
    const webTagInfoRaw = await fetchWebUserTktkSigRaw(client, signedURL);

    return webTagInfoRaw;
  } catch (error) {
    logError(`Error handleFetchLeads - fetchWebUser - ${error.stack}`);
    return {};
  }
};

module.exports = { fetchWebUser };
