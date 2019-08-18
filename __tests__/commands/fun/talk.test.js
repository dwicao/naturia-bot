/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/talk");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner("hello");

    expect(result).toBe("How are you?");
  });
});
