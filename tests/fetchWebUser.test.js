const fetch = require("node-fetch");
const { fetchWebUser } = require("../src/fetchWebUser");

const USERNAME = "andreswilley";
const USERNAME_NON_EXISTENT = "ashdlkjfioebjkaewuhrlakwjhlarhaew";

describe("TikTok API fetching as expected", () => {
  beforeEach(() => {
    jest.setTimeout(60000);
  });

  // WEB - SIGNATURE
  test("fetchWebUser", async () => {
    const data = await fetchWebUser(fetch, USERNAME);
    expect(typeof data).toBe("object");
    expect(data.user.id).toBe("525985");
    expect(data.user.uniqueId).toBe("andreswilley");
    expect(data.stats.followerCount).toBeGreaterThan(5000000);

    const userNonExistent = await fetchWebUser(fetch, USERNAME_NON_EXISTENT);
    expect(userNonExistent).toBeFalsy();
  });
});
