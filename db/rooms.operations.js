const ApiError = require("../error/errorClass");
const room = require("../models/room");
const User = require("../models/user");

const CreateRoomDB = async (data) => {
  const { userId, userName, roomName, roomPassword = "" } = data;
  if (!userName || !roomName || !userId) {
    throw ApiError.badRequest("Invalid data in request");
  }

  const currentUser = await User.findById(userId);
  if (!currentUser) {
    throw ApiError.badRequest("Invalid data in request");
  }

  const limitRooms = currentUser.limitRooms;
  const userRooms = currentUser.rooms;

  if (userRooms.length >= limitRooms) {
    throw "You have reached the maximum number of rooms";
  }

  const createdRoom = await room.create({
    roomName,
    roomPassword,
    owner: userId,
    users: [
      {
        userId,
        userName,
      },
    ],
  });

  currentUser.rooms.push(createdRoom.id);
  await currentUser.save();

  return createdRoom;
};

const EnterInRoomDB = async (data) => {
  const { userId, userName, roomId, roomPassword = "" } = data;

  if (!roomId || !userName || !userId) {
    throw ApiError.badRequest("Invalid data in request");
  }

  let existRoom;
  try {
    existRoom = await room.findById(roomId);
  } catch (e) {
    throw ApiError.notFound("Not found room");
  }

  const equilPassword = existRoom.roomPassword === roomPassword;
  if (!equilPassword) throw ApiError.forbidden("Invalid password");

  const userInRoom = existRoom.users.find((user) => user.userId === userId);
  if (!userInRoom) {
    await room.findOneAndUpdate(
      { _id: roomId },
      { $push: { users: { userName, userId } } }
    );
  }
  return existRoom;
};

const CheckIdRoomDB = async (roomId, userId) => {
  const isExistRoom = await room.findById(roomId).select("-__v -roomPassword");
  const user = await User.findById(userId);
  if (user.isUserInRoom) {
    throw ApiError.conflict(
      "You have already been in room (For join to room you should left prev room)"
    );
  }
  if (!isExistRoom) throw ApiError.notFound("Not found room");

  const userInRoom = isExistRoom.users.find((e) => e.userId === userId);
  if (!userInRoom) throw ApiError.forbidden("Please confirm room password");
  return isExistRoom;
};

const CheckRoomPasswordDB = async (id, data) => {
  const { roomPassword = "", userName, userId } = data;

  if (!userName || !userId || !id) {
    throw ApiError.badRequest("Invalid data in request");
  }

  const existRoom = await room.findById(id).select("-__v");
  if (!existRoom) throw ApiError.notFound("Not found room");

  const checkPassword = existRoom.roomPassword === roomPassword;
  if (!checkPassword) throw ApiError.forbidden("Invalid password");

  await room.findOneAndUpdate(
    { _id: id },
    { $push: { users: { userId, userName } } }
  );
  return existRoom;
};

module.exports = {
  CreateRoomDB,
  EnterInRoomDB,
  CheckIdRoomDB,
  CheckRoomPasswordDB,
};
