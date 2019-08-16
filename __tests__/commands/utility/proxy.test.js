/* eslint-env jest */
/* eslint-disable promise/catch-or-return */

const { runner, name } = require("../../../commands/utility/proxy");
const { JEST_TIMEOUT } = require("../../../utils");

jest.setTimeout(JEST_TIMEOUT);

describe(`${name} command`, () => {
  test("return correct value", () => {
    const IP_AND_PORT_PATTERN = /^([a-z0-9-]+\.)+[a-z0-9]+:[1-9][0-9]+$/i;

    runner().then(({ ipAndPort, content }) => {
      expect(ipAndPort).toHaveLength(100);
      expect(content.split("\n")).toHaveLength(20);

      ipAndPort.forEach(element => {
        expect(element).toMatch(IP_AND_PORT_PATTERN);
      });
    });
  });
});
