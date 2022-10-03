const API = "/api";
const ROOM = "/room";
const USER = "/user";

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


const USER_ENDPOINTS = {
  REGISTRATION_URL,
  LOGIN_URL,
  LOGOUT_URL,
  ACTIVATION_LINK_URL,
  GET_USER_URL,
  REFRESH_URL,
  UPDATE_URL,
}

const ROOM_ENDPOINTS = {
  CREATE_ROOM_URL,
  ENTER_ROOM_URL,
  ALL_ROOMS_URL,
  CHECK_ROOM_URL,
  LEAVE_URL,
  CHECK_PASSWORD_URL
}
module.exports = { API, ROOM, USER, ROOM_ENDPOINTS, USER_ENDPOINTS };