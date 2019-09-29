const path = require("path");
const fs = require("fs");
const request = require("request");
const UserAgent = require("user-agents");
const snek = require("node-superfetch");
const cheerio = require("cheerio");

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

const download = (url, dest, cb) => {
  const file = fs.createWriteStream(dest);
  const sendReq = request.get(url);

  // verify response code
  sendReq.on("response", response => {
    if (response.statusCode !== 200) {
      return cb(`Response status was ${response.statusCode}`);
    }

    sendReq.pipe(file);
  });

  // close() is async, call cb after close completes
  file.on("finish", () => file.close(cb));

  // check for request errors
  sendReq.on("error", err => {
    fs.unlink(dest);
    return cb(err.message);
  });

  file.on("error", err => {
    // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    return cb(err.message);
  });
};

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

const getSSLProxies = () =>
  new Promise((resolve, reject) => {
    const reqOptions = {
      url: "https://www.sslproxies.org"
    };

    request(reqOptions, (error, response, data) => {
      if (error) {
        reject(error);
      }

      const $ = cheerio.load(data);

      const tempData = [];

      $("#proxylisttable td").each((i, elem) => {
        tempData.push($(elem).text());
      });

      const matrixedData = toMatrix(tempData, 8);

      const LIMIT = 20;
      let content = "";
      let count = 0;

      matrixedData.forEach(element => {
        count++;
        element.forEach((elem, index) => {
          if (count < LIMIT) {
            const IS_IP_AND_PORT = index === 0 || index === 1;
            const IS_COUNTRY = index === 3;

            if (IS_IP_AND_PORT) {
              content += `${elem} `;
            }

            if (IS_COUNTRY) {
              content += `${elem}\n`;
            }
          }
        });
      });

      const ip = [];
      const port = [];

      tempData.forEach((item, index) => {
        if (index % 8 === 0) {
          ip.push(item);
          port.push(tempData[index + 1]);
        }
      });

      const ipAndPort = [];

      ip.forEach((item, index) => {
        ipAndPort.push(`${item}:${port[index]}`);
      });

      resolve({ ipAndPort });
    });
  });

const getRandomProxy = async url => {
  const { ipAndPort } = await getSSLProxies();
  const randomProxy = ipAndPort[getRandomInt(0, ipAndPort.length - 1)];
  const ipAddress = randomProxy.substr(0, randomProxy.indexOf(":"));
  const port = parseInt(
    randomProxy.substr(randomProxy.indexOf(":") + 1, randomProxy.length),
    10
  );

  const options = {
    url: url ? url : "https://www.google.com",
    proxy: `http://${randomProxy}`,
    timeout: 3000
  };

  let succeed = false;

  return new Promise((resolve, reject) => {
    const getGoodProxy = () => {
      if (succeed) return;

      request(options, (error, response, htmlData) => {
        if (error || !htmlData) {
          getGoodProxy();
          succeed = true;
        }

        if (htmlData && htmlData.length) {
          resolve(randomProxy);
        }
      });
    };

    getGoodProxy();
  });
};

const getRandomHugeProxy = url => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${getRootDir()}/public/huge-proxy.txt`,
      "utf8",
      (err, data) => {
        const splittedData = data.split("\n");
        const randomProxy =
          splittedData[getRandomInt(0, splittedData.length - 1)];
        const ipAddress = randomProxy.substr(0, randomProxy.indexOf(":"));
        const port = parseInt(
          randomProxy.substr(randomProxy.indexOf(":") + 1, randomProxy.length),
          10
        );
        const proxy = {
          ipAddress,
          port,
          protocol: "http"
        };

        if (err) {
          console.error(err);
          reject("Error while reading the proxy");
        }

        const options = {
          url: url ? url : "https://www.google.com",
          proxy: `http://${randomProxy}`,
          timeout: 3000
        };

        let succeed = false;

        const getGoodProxy = () => {
          if (succeed) return;

          request(options, (error, response, htmlData) => {
            if (error || !htmlData) {
              getGoodProxy();
              succeed = true;
            }

            if (htmlData && htmlData.length) {
              resolve(randomProxy);
            }
          });
        };

        getGoodProxy();
      }
    );
  });
};

const downloadAndgetRandomHugeProxy = url => {
  return new Promise((resolve, reject) => {
    download(
      "https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all&ssl=all&anonymity=all",
      `${getRootDir()}/public/huge-proxy.txt`,
      () => {
        getRandomHugeProxy(url)
          .then(data => resolve(data))
          .catch(err => reject(err));
      }
    );
  });
};

const getPuppeteerOptions = async url => {
  if (url) {
    const proxyServer = await getRandomProxy(url);

    return {
      args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-first-run",
        "--no-sandbox",
        "--no-zygote",
        `--proxy-server=${proxyServer}`
      ]
    };
  }

  return {
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote"
    ]
  };
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

const postHastebin = async text => {
  const { body } = await snek
    .post("https://www.hastebin.com/documents")
    .send(text);
  return `https://www.hastebin.com/${body.key}`;
};

const codeblock = (string, code) => {
  return `\`\`\`${code}\n${string}\`\`\``;
};

const getAllContentsFromXPATH = async ({ page, type, expression }) => {
  await page.waitForXPath(expression);
  const elements = await page.$x(expression);
  const result = await page.evaluate(
    (_type, ..._elements) => {
      return _elements.map(e => e[_type]);
    },
    type,
    ...elements
  );

  return result;
};

module.exports = {
  JEST_TIMEOUT,
  ProgressText,
  getPath,
  getRootDir,
  getRandomInt,
  getRandomProxy,
  getRandomHugeProxy,
  getPuppeteerOptions,
  getLoadingMessage,
  getParameterByName,
  getHeaders,
  getUserAgent,
  getErrorMessage,
  getUUID,
  getAllContentsFromXPATH,
  setActivity,
  sendErrorMessage,
  sendEditErrorMessage,
  isJpg,
  isPng,
  isSvg,
  download,
  downloadAndgetRandomHugeProxy,
  addHttpPrefix,
  limitString,
  promiseTimeout,
  toMatrix,
  postHastebin,
  codeblock
};
