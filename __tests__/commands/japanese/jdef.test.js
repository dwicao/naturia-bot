/* eslint-env jest */

const { runner, name, data } = require("../../../commands/japanese/jdef");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner("ohayou gozaimasu");

    expect(result.englishDefinition).toBe(
      "(int) good morning →Related words: お早うございます , 早い"
    );
    expect(result.japaneseDefinition).toBe(
      "おはよう。ご飯をよそっても良いかしら？"
    );
    expect(result.japaneseMeans).toBe("Morning. Shall I dish up?");
    expect(result.romaji[0]).toBe("おはよう(ohayou)");
  });
});
