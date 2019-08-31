require("dotenv").config();

const IS_PROD = process.env.ENV === "production";

module.exports = {
  prefix: IS_PROD ? "n." : "ns.",
  authorId: "442830299781529610",
  botId: IS_PROD ? "587954825539354645" : "617214224741040129"
};
