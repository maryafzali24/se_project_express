const { NODE_ENV } = process.env;

const JWT_SECRET =
  process.env.NODE_ENV === "production"
    ? process.env.JWT_SECRET
    : "Javascript2024";

module.exports = { NODE_ENV, JWT_SECRET };
