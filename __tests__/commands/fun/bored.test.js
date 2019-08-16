/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/bored");

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner();

    expect(result).toHaveProperty("activity");
    expect(result.activity).toBeTruthy();
  });
});
