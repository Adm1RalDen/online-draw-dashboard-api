const PORT = process.env.PORT;
const HOST = process.env.HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PROJECT = process.env.DATABASE;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SECRETKEY = process.env.SECRETKEY;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ORIGIN = process.env.ORIGIN;

const STATIC_FOLDER = "static";
const ACCESS_TOKEN_EXPIRES_IN = "5m";
const REFRESH_TOKEN_EXPIRES_IN = "6m";

module.exports = {
  HOST,
  DB_PASSWORD,
  DB_PROJECT,
  PORT,
  STATIC_FOLDER,
  SMTP_USER,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_PASSWORD,
  SECRETKEY,
  JWT_REFRESH_SECRET,
  ORIGIN,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
};
