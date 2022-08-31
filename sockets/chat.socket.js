const chatMessage = require("../models/chatMessage");
const { CHAT: { GET_CHAT, CHAT_MESSAGE, CHAT_ERROR } } = require("../const/sockets");

const onGetChat = async (socket) => {
  try {
    const chat = await chatMessage.find();
    socket.emit(GET_CHAT, chat);
  } catch (e) {
    socket.emit(CHAT_ERROR, e.message);
  }
};

const onMessage = async (socket, data, io) => {
  try {
    const message = await chatMessage.create({
      message: data.message,
      name: data.name,
      userId: data.userId,
    });
    await message.save();
    io.emit(CHAT_MESSAGE, message);
  } catch (e) {
    socket.emit(CHAT_ERROR, e.message);
  }
};

module.exports = { onGetChat, onMessage };
