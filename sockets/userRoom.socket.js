const Room = require("../models/room");
const User = require("../models/user");
const {
  USER_ROOM: {
    GET_ROOM,
    GET_USER_ROOMS,
    ERROR_GET_USER_ROOMS,
    DELETE_USER_ROOM_ERROR,
    UPDATE_USER_ROOM_ERROR,
    DELETE_USER_ROOM_SUCCESS,
    UPDATE_USER_ROOM_SUCCESS,
  },
  ROOM: { GET_ROOMS },
} = require("../const/sockets");
const user = require("../models/user");

const onGetUserRooms = async ({ userId = "" }, socket) => {
  try {
    const rooms = await Room.find()
      .where("owner")
      .equals(userId)
      .select("-__v");
    socket.emit(GET_USER_ROOMS, rooms);
  } catch (e) {
    socket.emit(ERROR_GET_USER_ROOMS, e?.message || "Occured error");
  }
};

const onDeleteUserRoom = async (data, socket, io) => {
  try {
    const { userId, roomId, roomPassword = "" } = data;
    let room;

    try {
      room = await Room.findById(roomId);
      if (!room) {
        throw "Not found room";
      }
    } catch (e) {
      throw "Delete error";
    }

    if (room.owner !== userId) {
      throw "You are not owner";
    }

    if (room.roomPassword !== roomPassword) {
      throw "Invalid password";
    }

    const currentUser = await user.findById(userId);

    if (!currentUser) {
      throw "Occured error";
    }

    currentUser.rooms = currentUser.rooms.filter((room) => room !== roomId);
    if (room.users.find((u) => u.userId === userId)) {
      currentUser.isUserInRoom = false;
    }
    await currentUser.save();
    await room.delete();

    const rooms = await Room.find().select("-__v");

    io.emit(GET_ROOMS, rooms.map(({ roomPassword, ...data }) => data)
      .filter((data) => data.status === true && data.isShow === true)
    );
    socket.emit(DELETE_USER_ROOM_SUCCESS);
    socket.emit(GET_USER_ROOMS, rooms.filter((data) => data.owner === userId));

  } catch (e) {
    if (typeof e === "string") {
      socket.emit(DELETE_USER_ROOM_ERROR, e);
    } else {
      socket.emit(DELETE_USER_ROOM_ERROR, e?.message || "Occured error");
    }
  }
};

const onUpdateUserRoom = async (data, socket, io) => {
  try {
    const { userId, roomId, ...newdata } = data;
    let room;
    try {
      room = await Room.findById(roomId);
      if (!room) {
        throw "Not found room (occured error)";
      }
    } catch (e) {
      throw "Not found room (occured error)"
    }

    if (room.owner !== userId) {
      throw "You are not owner";
    }

    await room.update(newdata);
    await room.save()

    const rooms = await Room.find().select("-__v");

    io.emit(GET_ROOMS, rooms
      .map(({ roomPassword, ...data }) => data)
      .filter((data) => data.status === true && data.isShow === true)
    );

    socket.emit(UPDATE_USER_ROOM_SUCCESS);
    socket.emit(GET_USER_ROOMS, rooms.filter((data) => data.owner === userId));
  } catch (e) {
    if (typeof e === "string") {
      socket.emit(UPDATE_USER_ROOM_ERROR, e);
    } else {
      socket.emit(UPDATE_USER_ROOM_ERROR, e?.message || "Occured error");
    }
  }
};

const onGetRooom = async (data, socket, io) => {
  try {
    const roomData = await Room.findById(data).select("-roomPassword -__v");
    socket.emit(GET_ROOM, roomData);
  } catch (e) {
    socket.emit("ERROR", "Occured error")
  }
};

module.exports = {
  onGetUserRooms,
  onDeleteUserRoom,
  onUpdateUserRoom,
  onGetRooom,
};
