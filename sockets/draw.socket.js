const { DRAW: { START_DRAW, FINISH_DRAW, CONNECTION_DRAW, SET_SNAPSHOT, SEND_SNAPSHOT } } = require("../const/sockets")
const room = require("../models/room")

const onDraw = async (data, socket) => {
  socket.to(data.roomId).emit(START_DRAW, data)
}

const onFinishDraw = async (data, socket, io) => {
  io.in(data.roomId).emit(FINISH_DRAW, data)
}

const onConnectionDraw = async (data, socket) => {
  socket.to(data.roomId).emit(CONNECTION_DRAW, data.userName)
}

const onGetSnapshot = async (data, socket, io) => {
  const { roomId, socketId, userId } = data;
  const currentRoom = await room.findById(roomId);

  if (currentRoom.owner !== userId) {
    io.in(roomId).emit(SEND_SNAPSHOT, currentRoom.owner, socket.id);
  }
}

const onSetSnapshot = async (data, socket, io) => {
  const { img, recipient } = data;
  io.to(recipient).emit(SET_SNAPSHOT, img);
}
module.exports = { onDraw, onFinishDraw, onConnectionDraw, onGetSnapshot, onSetSnapshot };