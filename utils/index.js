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

const JEST_TIMEOUT = 10000;

module.exports = {
  JEST_TIMEOUT,
  getPath,
  getRootDir,
  getRandomInt,
  getRandomProxy,
  setActivity,
  sendErrorMessage,
  sendEditErrorMessage,
  limitString,
  getHeaders,
  toMatrix
};
