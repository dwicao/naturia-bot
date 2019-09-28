const path = require("path");
const publicPathName = path.join(__dirname, "public");

const public_file = (req, res) => {
  if (req.query.name) {
    res.sendFile(path.join(publicPathName, `${req.query.name}`));
  } else {
    res.sendStatus(400);
  }
};

module.exports = public_file;
