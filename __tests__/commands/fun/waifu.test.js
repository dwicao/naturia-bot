/* eslint-env jest */

const fetch = require("node-fetch");
const { url, name } = require("../../../commands/fun/waifu");
const { JEST_TIMEOUT, isJpg } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const getResult = () => fetch(url).then(res => res.buffer());
    const buffer = await getResult();

    expect(isJpg(buffer)).toBe(true);
  });
});
