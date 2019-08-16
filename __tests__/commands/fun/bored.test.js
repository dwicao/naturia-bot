/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/bored");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner();

    expect(result).toHaveProperty("activity");
    expect(result.activity).toBeTruthy();
  });
});
