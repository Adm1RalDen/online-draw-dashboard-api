const { onGetRooms, onCreateRoom, onJoin, onExit, onJoinAccess } = require("./room.socket");
const { onGetChat, onMessage, onGetUpdatedChat } = require("./chat.socket");
const { onGetUserRooms, onDeleteUserRoom, onUpdateUserRoom, onGetRooom } = require("./userRoom.socket");
const { onDraw, onFinishDraw, onUserConnected, onGetSnapshot, onSetSnapshot } = require("./draw.socket");
const {
  DISCONNECT,
  CHAT: { CHAT_MESSAGE, GET_CHAT, GET_UPDATED_CHAT },
  ROOM: { CREATE_ROOM, EXIT, GET_ROOMS, JOIN_ROOM, JOIN_ACCESS },
  USER_ROOM: { DELETE_USER_ROOM, GET_ROOM, GET_USER_ROOMS, UPDATE_USER_ROOM },
  DRAW: { CONNECTION_DRAW, FINISH_DRAW, START_DRAW, SEND_SNAPSHOT, GET_SNAPSHOT }
} = require("../const/sockets");

const users = new Map()

const setSockets = (socket, io) => {
  const userId = socket.handshake.query.userId

  if (users.has(userId)) {
    users.set(userId, [...users.get(userId), socket]);
  }
  else {
    users.set(userId, [socket])
  }

  console.log('CONNECTED', socket.id)

  socket.on(DISCONNECT, () => {
    console.log(DISCONNECT, socket.id)
  });

  socket.on(GET_CHAT, () => onGetChat(socket));
  socket.on(GET_UPDATED_CHAT, () => onGetUpdatedChat(socket, io))
  socket.on(CHAT_MESSAGE, (data) => onMessage(data, socket, io));
 
  socket.on(GET_ROOMS, (data) => onGetRooms(socket, data))
  socket.on(CREATE_ROOM, (data) => onCreateRoom(socket, data, io, users))
  socket.on(JOIN_ROOM, (data) => onJoin(socket, data, io, users))

  socket.on(JOIN_ACCESS, (data) => onJoinAccess(socket, data, io))
  socket.on(EXIT, (data) => onExit(data, socket, io, users))

  socket.on(GET_ROOM, (data) => onGetRooom(data, socket, io))
  socket.on(GET_USER_ROOMS, (data) => onGetUserRooms(data, socket))
  socket.on(DELETE_USER_ROOM, (data) => onDeleteUserRoom(data, socket, io, users))
  socket.on(UPDATE_USER_ROOM, (data) => onUpdateUserRoom(data, socket, io, users))

  socket.on(START_DRAW, (data) => onDraw(data, socket))
  socket.on(CONNECTION_DRAW, (data) => onUserConnected(data, socket, users))
  socket.on(FINISH_DRAW, (data) => onFinishDraw(data, io))
  socket.on(GET_SNAPSHOT, (data) => onGetSnapshot(data, socket, io))
  socket.on(SEND_SNAPSHOT, (data) => onSetSnapshot(data, io))
};

module.exports = { setSockets };
