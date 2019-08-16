/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/advice");

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner();

    expect(result).toHaveProperty("slip");
    expect(result.slip).toHaveProperty("advice");
    expect(result.slip.advice).toBeTruthy();
  });
});
