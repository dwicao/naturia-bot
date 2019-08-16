/* eslint-env jest */

const fetch = require("node-fetch");
const { baseURI, name } = require("../../../commands/fun/face");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("able to fetch the image", async () => {
    const getResult = () => fetch(`${baseURI}john`).then(res => res.buffer());
    const buffer = await getResult();

    expect(Buffer.isBuffer(buffer)).toBe(true);
  });
});
