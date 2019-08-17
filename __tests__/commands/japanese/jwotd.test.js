/* eslint-env jest */

const fetch = require("node-fetch");
const { runner, name } = require("../../../commands/japanese/jwotd");
const { JEST_TIMEOUT, isJpg } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", async () => {
    const result = await runner();
    const getImage = () => fetch(result.image).then(res => res.buffer());
    const imageBuffer = await getImage();

    expect(result.kana).toBeTruthy();
    expect(result.romaji).toBeTruthy();
    expect(result.english).toBeTruthy();
    expect(result.englishClass).toBeTruthy();
    expect(result.exampleKana[0]).toBeTruthy();
    expect(result.exampleRomaji[0]).toBeTruthy();
    expect(result.exampleEnglish[0]).toBeTruthy();
    expect(isJpg(imageBuffer)).toBe(true);
  });
});
