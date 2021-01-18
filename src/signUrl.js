const TikTokScraper = require("tiktok-scraper");
const wait = require("waait");

const { logError } = require("./log");

// NOTE: This is to avoid local server concurrency issues
const DELAY_SIGN_MILLIS = 100;

const signUrl = async (URLExclSig) => {
  try {
    const signature = await TikTokScraper.signUrl(URLExclSig);
    return `${URLExclSig}&_signature=${signature}`;
  } catch (error) {
    logError(
      `Error handleFetchLeads / handleFetchPosts - fetchUnsignedURLWithSigner ${error.stack}`
    );
    return "";
  }
};

const signUrls = async (URLsExclSig) => {
  const signedURLs = await Promise.all(
    URLsExclSig.map(async (URLExclSig, index) => {
      await wait(DELAY_SIGN_MILLIS * index);
      const urlsigned = await signurl(urlexclsig);
      return urlsigned;
    })
  );
  return signedURLs;
};

module.exports = { signUrl, signUrls };
