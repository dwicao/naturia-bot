/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/gender");

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const FIRST_NAME = "john";
    const EXPECTED_GENDER = "male";
    const result = await runner(FIRST_NAME);

    expect(result).toHaveProperty("name");
    expect(result.name).toEqual(FIRST_NAME);
    expect(result).toHaveProperty("gender");
    expect(result.gender).toEqual(EXPECTED_GENDER);
    expect(result).toHaveProperty("probability");
    expect(result.probability).toBeGreaterThanOrEqual(0);
    expect(result.probability).toBeLessThanOrEqual(1);
  });
});
