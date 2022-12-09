const ChatMessage = require("../models/chat-message");
const User = require("../models/user");

const { Types } = require("mongoose");

const {
  CHAT: { GET_CHAT, CHAT_MESSAGE, CHAT_ERROR },
} = require("../const/sockets");

const getChat = () =>
  ChatMessage.find()
    .populate("user", "avatar name", User)
    .sort("-createdAt")
    .limit(100);

const onGetChat = async (socket) => {
  try {
    const chat = await getChat();

    socket.emit(GET_CHAT, chat.reverse());
  } catch (e) {
    socket.emit(CHAT_ERROR, e?.message || "Occured error");
  }
};

const onMessage = async ({ message, userId }, socket, io) => {
  try {
    let newMessage = new ChatMessage({
      message,
      user: Types.ObjectId(userId),
    });

    await ChatMessage.populate(newMessage, {
      path: "user",
      select: "name avatar id",
    });

    await newMessage.save();

    io.emit(CHAT_MESSAGE, newMessage);
  } catch (e) {
    socket.emit(CHAT_ERROR, e?.message || "Occured error");
  }
};

const onGetUpdatedChat = async (socket, io) => {
  try {
    const chat = await getChat();

    io.emit(GET_CHAT, chat.reverse());
  } catch (e) {
    socket.emit(CHAT_ERROR, e?.message || "Occured error");
  }
};
module.exports = { onGetChat, onMessage, onGetUpdatedChat };
