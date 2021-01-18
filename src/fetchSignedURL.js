const TikTokScraper = require("tiktok-scraper");
const wait = require("waait");

const { logError } = require("./log");

// This is to avoid local server concurrency issues
const DELAY_SIGN_MILLIS = 100;

const fetchSignedURLWithSigner = async (URLExclSig) => {
  try {
    const signature = await TikTokScraper.signUrl(URLExclSig);
    const signedURL = `${URLExclSig}&_signature=${signature}`;

    return signedURL;
  } catch (error) {
    logError(
      `Error handleFetchLeads / handleFetchPosts - fetchSignedURLWithSigner ${error.stack}`
    );
    return "";
  }
};

const fetchAllSignedURLsWithSigner = async (URLsExclSig) => {
  // const fetchAllSignedURLsWithSigner = async (signer, URLsExclSig) => {
  try {
    const signedURLs = await Promise.all(
      URLsExclSig.map(async (URLExclSig, index) => {
        await wait(DELAY_SIGN_MILLIS * index);
        // const URLSigned = await fetchSignedURLWithSigner(signer, URLExclSig);
        const URLSigned = await fetchSignedURLWithSigner(URLExclSig);
        return URLSigned;
      })
    );
    return signedURLs;
  } catch (error) {
    if (error.code === "ERR_CONNECTION_REFUSED") {
      logError(
        `Error handleFetchPosts - fetchSignedUrlsWithSigner local server connection error, check local server is running - ${error.stack}`
      );
    } else {
      logError(
        `Error handleFetchLeads / handleFetchPosts - fetchAllSignedURLsWithSigner ${error.stack}`
      );
    }
    return [];
  }
};

const fetchAllSignedURLs = async (URLsExclSig) => {
  let signedURLs = [];
  try {
    signedURLs = await fetchAllSignedURLsWithSigner(URLsExclSig);
  } catch (error) {
    logError(
      `Error handleFetchLeads / handleFetchPosts - fetchAllSignedURLs closing signer ${error.stack}`
    );
  }
  return signedURLs;
};

const fetchSignedURL = async (URLExclSig) => {
  const URLsExclSig = [URLExclSig];
  const URLsSigned = await fetchAllSignedURLs(URLsExclSig);
  const signedURL = URLsSigned[0];
  return signedURL;
};

module.exports = { fetchSignedURL, fetchAllSignedURLs };
