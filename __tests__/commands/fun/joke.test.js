/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/joke");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner();

    expect(result).toHaveProperty("punchline");
    expect(result).toHaveProperty("setup");
    expect(result.punchline).toBeTruthy();
    expect(result.setup).toBeTruthy();
  });
});
