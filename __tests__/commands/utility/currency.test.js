/* eslint-env jest */

const { runner, name, data } = require("../../../commands/utility/currency");

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const BASE = "USD";
    const result = await runner(BASE);

    expect(result).toHaveProperty("base", BASE);
    expect(result).toHaveProperty("date");
    expect(result).toHaveProperty("rates");
    expect(Object.keys(result.rates)).toEqual(expect.arrayContaining(data));
  });
});
