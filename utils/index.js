const path = require("path");
const fs = require("fs");
const UserAgent = require("user-agents");

const IS_PROD = process.env.ENV === "production";
const ERROR_MESSAGE = ":x: Error: Couldn't get the data! Please Try Again";

class ProgressText {
  constructor() {
    this.total = 0;
    this.current = 0;
  }

  init(total) {
    this.total = total;
    this.current = 0;
    this.update(this.current);
  }

  update(current) {
    if (current) {
      this.current = current;
    } else {
      this.current = this.current + 1;
    }

    return `Loading data... (${this.current} out of ${this.total})`;
  }
}

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

      resolve(splittedData[getRandomInt(0, splittedData.length - 1)]);
    });
  });
};

const getHeaders = () => {
  return {
    "User-Agent": new UserAgent().toString()
  };
};

const getUserAgent = () => new UserAgent().toString();

const getErrorMessage = () => ERROR_MESSAGE;

const sendErrorMessage = (message, err) => {
  if (err) {
    console.error(err);
  }

  if (message && message.channel && message.channel.send) {
    const err_msg =
      err && err.message ? `:x: Error: ${err.message}` : ERROR_MESSAGE;

    return message.channel.send(err_msg).then(msg => {
      return msg.delete(10000);
    });
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

const getLoadingMessage = (now, total) => {
  now += 1;
  return `Loading data... (${now} out of ${total})`;
};

const addHttpPrefix = str => {
  if (str.indexOf("http://") !== -1 || str.indexOf("https://") !== -1) {
    return str;
  }

  return `http://${str}`;
};

const getParameterByName = (url, name) => {
  const _name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${_name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const promiseTimeout = time => value =>
  new Promise(resolve => setTimeout(resolve(value), time));

const getUUID = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15);

module.exports = {
  JEST_TIMEOUT,
  ProgressText,
  getPath,
  getRootDir,
  getRandomInt,
  getRandomProxy,
  getLoadingMessage,
  getParameterByName,
  getHeaders,
  getUserAgent,
  getErrorMessage,
  getUUID,
  setActivity,
  sendErrorMessage,
  sendEditErrorMessage,
  isJpg,
  isPng,
  isSvg,
  addHttpPrefix,
  limitString,
  promiseTimeout,
  toMatrix
};
