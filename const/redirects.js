const SUCCESS_GOOGLE_REDIRECT = `${process.env.ORIGIN}/auth/google/success`
const GOOGLE_USE2FA_REDIRECT = `${process.env.ORIGIN}/auth/google/twoFactor`
const FAILURE_GOOGLE_REDIRECT = `${process.env.ORIGIN}/auth/google/failure`
const AUTH_GOOGLE_CALLBACK = `${process.env.HOST}/api/auth/google/callback`

module.exports = { SUCCESS_GOOGLE_REDIRECT, FAILURE_GOOGLE_REDIRECT, AUTH_GOOGLE_CALLBACK, GOOGLE_USE2FA_REDIRECT }