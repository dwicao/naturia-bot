/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/name");

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner();

    expect(result).toHaveProperty("gender");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("region");
    expect(result).toHaveProperty("surname");
    expect(result.gender).toBeTruthy();
    expect(result.name).toBeTruthy();
    expect(result.region).toBeTruthy();
    expect(result.surname).toBeTruthy();
  });
});
