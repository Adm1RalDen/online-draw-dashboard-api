const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "http://localhost:5000";
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PROJECT = process.env.DATABASE;
const STATIC_FOLDER = "static";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SECRETKEY = process.env.SECRETKEY;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ORIGIN = process.env.ORIGIN || "http://localhost:3000";

module.exports = { HOST, DB_PASSWORD, DB_PROJECT, PORT, STATIC_FOLDER, SMTP_USER, SMTP_HOST, SMTP_PORT, SMTP_PASSWORD, SECRETKEY, JWT_REFRESH_SECRET, ORIGIN };