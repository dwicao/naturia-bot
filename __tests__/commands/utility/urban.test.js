/* eslint-env jest */

const { runner, name } = require("../../../commands/utility/urban");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner("normies");

    expect(result.definition).toBeTruthy();
    expect(result.example).toBeTruthy();
  });
});
