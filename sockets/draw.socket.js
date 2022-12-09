const { DRAW: { START_DRAW, FINISH_DRAW, CONNECTION_DRAW, SET_SNAPSHOT, SEND_SNAPSHOT } } = require("../const/sockets")
const room = require("../models/room")

const onDraw = (data, socket) => {
  socket.to([data.roomId]).emit(START_DRAW, data)
}

const onFinishDraw = (data, io) => {
  io.in([data.roomId]).emit(FINISH_DRAW, data)
}

const onUserConnected = ({ userName, userId, roomId }, socket, users) => {
  const userSockets = users.get(userId).map((s) => s.id)

  socket.to([roomId]).except([...userSockets]).emit(CONNECTION_DRAW, userName)
}

const onGetSnapshot = async ({ roomId, userId }, socket, io) => {
  const currentRoom = await room.findById(roomId);

  if (currentRoom.owner !== userId) {
    io.in(roomId).emit(SEND_SNAPSHOT, currentRoom.owner, socket.id);
  }
}

const onSetSnapshot = ({ img, recipient }, io) => {
  io.to(recipient).emit(SET_SNAPSHOT, img);
}

module.exports = { onDraw, onFinishDraw, onUserConnected, onGetSnapshot, onSetSnapshot };