/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/pfp");

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner();

    expect(result.startsWith("https://cdn.picrew.me/app/share/")).toBe(true);
  });
});
