/* eslint-env jest */

const { runner } = require("../../../commands/utility/math");

describe("Math command", () => {
  test("return correct value", async () => {
    const INPUT = "8 * 2 (3+7)";
    const EXPECTED_OUTPUT = "160";
    const mathResult = await runner(INPUT);

    expect(mathResult).toEqual(EXPECTED_OUTPUT);
  });
});
