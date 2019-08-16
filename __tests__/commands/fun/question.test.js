/* eslint-env jest */

const { runner, name } = require("../../../commands/fun/question");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner("javascript", "W9X3Y2-WW4UY2PKTW");

    expect(result).toBe(
      "JavaScript, often abbreviated as JS, is a high–level, interpreted programming language that conforms to the ECMAScript specification."
    );
  });
});
