const API = "/api";
const ROOM = "/room";
const USER = "/user";
const AUTH = "/auth";

const CREATE_ROOM_URL = "/create";
const ENTER_ROOM_URL = "/enter";
const ALL_ROOMS_URL = "/all";
const CHECK_ROOM_URL = "/check/:id";
const LEAVE_URL = "/leave";
const CHECK_PASSWORD_URL = "/checkRoomPassword/:id";

const REGISTRATION_URL = "/registration";
const LOGIN_URL = "/login";
const LOGOUT_URL = "/logout";
const ACTIVATION_LINK_URL = "/activate/:link";
const GET_USER_URL = "/:id";
const REFRESH_URL = "/refresh";
const UPDATE_URL = "/update";
const VERIFY_2FA_URL = "/verify";
const CREATE_2FA = "/create-twoFa";
const CONFIRM_CREATING_2FA = "/confirm-creating-2fa";
const SEND_CODE_ON_MAIL = "/send-code-on-mail";
const DISABLE_2FA = "/disable-2fa";

const GOOGLE_SIGN_IN_ENDPOINT = "/google";
const GOOGLE_SIGN_IN_CALLBACK_ENDPOINT = "/google/callback";
const GOOGLE_SIGN_IN_FAILURE_ENDPOINT = "/api/auth/google/failure";

const USER_ENDPOINTS = {
  VERIFY_2FA_URL,
  REGISTRATION_URL,
  LOGIN_URL,
  LOGOUT_URL,
  ACTIVATION_LINK_URL,
  GET_USER_URL,
  REFRESH_URL,
  UPDATE_URL,
  CREATE_2FA,
  CONFIRM_CREATING_2FA,
  SEND_CODE_ON_MAIL,
  DISABLE_2FA
};

const ROOM_ENDPOINTS = {
  CREATE_ROOM_URL,
  ENTER_ROOM_URL,
  ALL_ROOMS_URL,
  CHECK_ROOM_URL,
  LEAVE_URL,
  CHECK_PASSWORD_URL,
};

const GOOGLE_AUTH_ENDPOINTS = {
  GOOGLE_SIGN_IN_ENDPOINT,
  GOOGLE_SIGN_IN_CALLBACK_ENDPOINT,
  GOOGLE_SIGN_IN_FAILURE_ENDPOINT,
};

module.exports = {
  API,
  ROOM,
  USER,
  AUTH,
  ROOM_ENDPOINTS,
  USER_ENDPOINTS,
  GOOGLE_AUTH_ENDPOINTS,
};
