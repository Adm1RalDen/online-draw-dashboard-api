const { onGetRooms, onCreateRoom, onJoin, onExit, onJoinAccess } = require("./room.socket");
const { onGetChat, onMessage } = require("./chat.socket");
const { onGetUserRooms, onDeleteUserRoom, onUpdateUserRoom, onGetRooom } = require("./userRoom.socket");
const { onDraw, onFinishDraw, onConnectionDraw } = require("./draw.socket");
const {
  CONNECTION,
  DISCONNECT,
  CHAT: { CHAT_MESSAGE, GET_CHAT },
  ROOM: { CREATE_ROOM, EXIT, GET_ROOMS, JOIN_ROOM, JOIN_ACCESS },
  USER_ROOM: { DELETE_USER_ROOM, GET_ROOM, GET_USER_ROOMS, UPDATE_USER_ROOM },
  DRAW: { CONNECTION_DRAW, FINISH_DRAW, START_DRAW }
} = require("../const/sockets");

const setSockets = (socket, io) => {
  console.log(CONNECTION, socket.id)

  socket.on(DISCONNECT, () => {
    console.log(DISCONNECT, socket.id)
  });

  socket.on(GET_CHAT, () => onGetChat(socket));
  socket.on(CHAT_MESSAGE, (data) => onMessage(socket, data, io));

  socket.on(GET_ROOMS, (data) => onGetRooms(socket, data))
  socket.on(CREATE_ROOM, (data) => onCreateRoom(socket, data, io))
  socket.on(JOIN_ROOM, (data) => onJoin(socket, data, io))
 
  socket.on(JOIN_ACCESS, (data) => onJoinAccess(socket, data, io))
  socket.on(EXIT, (data) => onExit(socket, data, io))

  socket.on(GET_ROOM, (data) => onGetRooom(data, socket, io))
  socket.on(GET_USER_ROOMS, (data) => onGetUserRooms(data, socket))
  socket.on(DELETE_USER_ROOM, (data) => onDeleteUserRoom(data, socket, io))
  socket.on(UPDATE_USER_ROOM, (data) => onUpdateUserRoom(data, socket, io))

  socket.on(START_DRAW, (data) => onDraw(data, socket, io))
  socket.on(CONNECTION_DRAW, (data) => onConnectionDraw(data, socket, io))
  socket.on(FINISH_DRAW, (data) => onFinishDraw(data, socket, io))
};

module.exports = { setSockets };
