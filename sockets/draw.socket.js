const { DRAW: { START_DRAW, FINISH_DRAW, CONNECTION_DRAW } } = require("../const/sockets")

const onDraw = async (data, socket) => {
  socket.to(data.roomId).emit(START_DRAW, data)
}

const onFinishDraw = async (data, socket, io) => {
  io.in(data.roomId).emit(FINISH_DRAW, data)
}

const onConnectionDraw = async (data, socket) => {
  socket.to(data.roomId).emit(CONNECTION_DRAW, data.userName)
}

module.exports = { onDraw, onFinishDraw, onConnectionDraw };