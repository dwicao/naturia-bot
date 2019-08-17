/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/wotd");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner();

    expect(result.title).toBeTruthy();
    expect(result.syllables).toBeTruthy();
    expect(result.attribute).toBeTruthy();
    expect(result.definition).toBeTruthy();
    expect(result.examples).toBeTruthy();
    expect(result.info).toBeTruthy();
  });
});
