const fetch = require("fetch-vcr");
const { fetchWebUser } = require("../src/fetchWebUser");

fetch.configure({
  fixturePath: './tests/fixtures',
  mode: 'cache' // playback, cache, record
})

const USERNAME = "andreswilley";
const USERNAME_NON_EXISTENT = "ashdlkjfioebjkaewuhrlakwjhlarhaew";

describe("fetchWebUser", () => {
  test("returns parsed user object", async () => {
    const data = await fetchWebUser(fetch, USERNAME);
    expect(data.user).toMatchObject({
      id: "525985",
      uniqueId: "andreswilley"
    });
  });

  test("returns parsed stats object", async () => {
    const data = await fetchWebUser(fetch, USERNAME);
    expect(data.stats.followerCount).toBeGreaterThan(5000000);
  });

  test("handles http response errors", async () => {
    const userNonExistent = await fetchWebUser(fetch, USERNAME_NON_EXISTENT);
    expect(userNonExistent).toBeFalsy();
  });
});
