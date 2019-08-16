/* eslint-env jest */

const { runner, name } = require("../../../commands/utility/math");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const INPUT = "8 * 2 (3+7)";
    const EXPECTED_OUTPUT = "160";
    const mathResult = await runner(INPUT);

    expect(mathResult).toEqual(EXPECTED_OUTPUT);
  });
});
