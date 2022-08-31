const { CreateRoomDB, EnterInRoomDB, CheckIdRoomDB, CheckRoomPasswordDB } = require("../db/rooms.operations");
const ApiError = require("../error/errorClass");
const room = require("../models/room");

const createRoom = async (req, res, next) => {
  try {
    const createdRoom = await CreateRoomDB(req.body);
    return res.status(200).json(createdRoom);
  } catch (e) {
    next(e);
  }
};

const enterInRoom = async (req, res, next) => {
  try {
    const existRoom = await EnterInRoomDB(req.body)
    return res.status(200).json(existRoom);
  } catch (e) {
    next(e);
  }
};

const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await room.find().select("-__v -roomPassword");
    return res.status(200).json(rooms);
  } catch (e) {
    next(e);
  }
};

const checkIdRoom = async (req, res, next) => {
  try {
    try {
      const existRoom = await CheckIdRoomDB(req.params.id, req.body.userId)
      return res.status(200).json(existRoom);
    } catch (e) {
      throw new ApiError.badRequest("Not found room")
    }
  } catch (e) {
    next(e);
  }
};

const exitFromRoom = async (req, res, next) => {
  const { roomId, userId } = req.body;
  const currentRoom = await room.findById(roomId);
  currentRoom.users = currentRoom.users.filter(user => user.userId !== userId);
  await currentRoom.save();
  return res.status(200).json()
};


const checkRoomPassword = async (req, res, next) => {
  try {
    await CheckRoomPasswordDB(req.params.id, req.body)
    return res.status(200).json();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createRoom,
  checkIdRoom,
  checkRoomPassword,
  enterInRoom,
  getAllRooms,
  exitFromRoom
};
