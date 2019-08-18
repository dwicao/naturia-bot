const path = require("path");
const fs = require("fs");
const UserAgent = require("user-agents");

const IS_PROD = process.env.ENV === "production";
const ERROR_MESSAGE = "Error while fetching data! Please Try Again.";

const setActivity = client => {
  if (IS_PROD) {
    client.user.setActivity("n.help", { type: "LISTENING" });
  } else {
    client.user.setActivity("MAINTENANCE MODE", { type: "PLAYING" });
  }
};

const getPath = dir => {
  const result = [];

  const files = [dir];
  do {
    const filepath = files.pop();
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      fs.readdirSync(filepath).forEach(f => files.push(path.join(filepath, f)));
    } else if (stat.isFile()) {
      result.push(path.relative(dir, filepath));
    }
  } while (files.length !== 0);

  return result;
};

const getRootDir = () => __dirname.substring(0, __dirname.indexOf("/utils"));

const limitString = (str, maxLength) => {
  return str.length > maxLength ? `${str.substring(0, maxLength - 3)}...` : str;
};

const toMatrix = (arr, width) =>
  arr.reduce(
    (rows, key, index) =>
      (index % width === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  );

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomProxy = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${getRootDir()}/public/proxy.txt`, "utf8", (err, data) => {
      const splittedData = data.toString().split("\n");

      if (err) {
        console.error(err);

        resolve(splittedData[0]);
      }

      resolve(splittedData[getRandomInt(0, splittedData.length)]);
    });
  });
};

const getHeaders = () => {
  return {
    "User-Agent": new UserAgent().toString()
  };
};

const sendErrorMessage = (message, err) => {
  if (err) {
    console.error(err);
  }

  if (message && message.channel && message.channel.send) {
    message.channel.send(ERROR_MESSAGE);
  }
};

const sendEditErrorMessage = (message, err) => {
  if (err) {
    console.error(err);
  }

  if (message && message.edit) {
    message.edit(ERROR_MESSAGE);
  }
};

const JEST_TIMEOUT = 15000;

const isJpg = buffer => {
  if (!buffer || buffer.length < 3) {
    return false;
  }

  return buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
};

const isPng = buffer => {
  if (!buffer || buffer.length < 8) {
    return false;
  }

  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
};

const isSvg = buffer => {
  const isBuffer = Buffer.isBuffer(buffer);

  for (let i = 0; i < 24; i++) {
    const characterCode = isBuffer ? buffer[i] : buffer.charCodeAt(i);

    if (characterCode === 65533 || characterCode <= 8) {
      return true;
    }
  }

  return false;
};

module.exports = {
  JEST_TIMEOUT,
  getPath,
  getRootDir,
  getRandomInt,
  getRandomProxy,
  setActivity,
  sendErrorMessage,
  sendEditErrorMessage,
  isJpg,
  isPng,
  isSvg,
  limitString,
  getHeaders,
  toMatrix
};
