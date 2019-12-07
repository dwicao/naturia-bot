const wotd = require("./wotd");
const hn = require("./hn");
const joke = require("./joke");
const javascript_trending = require("./javascript_trending");
const tech_jobs = require("./tech_jobs");
const steam_deals = require("./steam_deals");
const random_anime = require("./random_anime");
const random_pfp = require("./random_pfp");
const disboard_status = require("./disboard_status");
const netflix_recommender = require("./netflix_recommender");
const doraemon = require("./doraemon");
const premium_users = require("./premium_users");
const public_file = require("./public_file");
const typing = require("./typing");

const root = (req, res) => {
  res.render("index");
};

module.exports = {
  root,
  public_file,
  wotd,
  hn,
  joke,
  javascript_trending,
  tech_jobs,
  steam_deals,
  random_anime,
  random_pfp,
  disboard_status,
  netflix_recommender,
  doraemon,
  typing,
  premium_users
};
