/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/quote");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner();

    expect(result).toHaveProperty("quote");
    expect(result.quote).toHaveProperty("body");
    expect(result.quote).toHaveProperty("author");
    expect(result.quote.body).toBeTruthy();
    expect(result.quote.author).toBeTruthy();
  });
});
