/* eslint-env jest */

const {
  getPath,
  getRootDir,
  getRandomInt,
  getRandomProxy,
  limitString,
  getHeaders,
  toMatrix
} = require("../../utils");

describe("Utils function", () => {
  test(`'getPath()' return value correctly`, () => {
    const result = getPath("./commands");

    expect(result).toContain("core/help.js");
    expect(result).toContain("fun/advice.js");
    expect(result).toContain("japanese/jdef.js");
    expect(result).toContain("music/play.js");
    expect(result).toContain("utility/currency.js");
  });

  test(`'getRootDir()' return value correctly`, () => {
    const result = getRootDir();

    expect(result).toMatch(/naturia-bot$/);
  });

  test(`'getRandomInt()' return value correctly`, () => {
    const result = getRandomInt(0, 1000);
    const result2 = getRandomInt(0, 1000);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1000);
    expect(result).not.toBe(result2);
  });

  test(`'getRandomProxy()' return`, async () => {
    const IP_AND_PORT_PATTERN = /^([a-z0-9-]+\.)+[a-z0-9]+:[1-9][0-9]+$/i;

    const proxy = await getRandomProxy();
    const proxy2 = await getRandomProxy();

    expect(proxy).toMatch(IP_AND_PORT_PATTERN);
    expect(proxy).not.toBe(proxy2);
  });

  test(`'limitString()' return value correctly`, () => {
    const MAX_LENGTH = 5;
    const STR = "123456789";
    const EXPECTED_STR = "12...";

    expect(limitString(STR, MAX_LENGTH)).toBe(EXPECTED_STR);
  });

  test(`'getHeaders()' return value correctly`, () => {
    const header = getHeaders();
    const header2 = getHeaders();

    expect(header).toBeTruthy();
    expect(header).not.toBe(header2);
  });

  test(`'toMatrix()' return value correctly`, () => {
    const ARR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const EXPECTED_ARR = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
    const TOTAL_MATRIX = 3;

    expect(toMatrix(ARR, TOTAL_MATRIX)).toEqual(EXPECTED_ARR);
  });
});
