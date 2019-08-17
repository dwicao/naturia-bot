/* eslint-env jest */

const { runner, name } = require("../../../commands/japanese/jname");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner("female");

    expect(result.name).toBeTruthy();
    expect(result.kanji).toBeTruthy();
    expect(result.pronunciation).toBeTruthy();
    expect(result._response.request.uri.href).toBe(result.url.female);
  });
});
