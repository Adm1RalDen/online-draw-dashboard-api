const { CreateRoomDB } = require("../db/rooms.operations");
const Room = require("../models/room");
const {
  ROOM: {
    GET_ROOMS,
    CREATE_ERROR,
    CREATE_SUCCESS,
    JOIN_ROOM_ERROR,
    JOIN_ROOM_SUCCESS,
  },
  USER_ROOM: { GET_ROOM },
  DRAW: { CASE_EXIT },
} = require("../const/sockets");
const User = require("../models/user");

const getRooms = async () => {
  return Room.find()
    .where("status")
    .equals(true)
    .where("isShow")
    .equals(true)
    .select("-roomPassword -__v");
};

const onGetRooms = async (socket) => {
  try {
    const rooms = await getRooms();
    socket.emit(GET_ROOMS, rooms);
  } catch (e) {
    socket.emit("ERROR", e?.message || "Ocurred error");
  }
};

const onCreateRoom = async (socket, data, io, users) => {
  try {
    const user = await User.findById(data.userId);

    if (!user.isUserInRoom) {
      const room = await CreateRoomDB(data);
      const rooms = await getRooms();

      user.isUserInRoom = true;
      user.save();

      io.emit(GET_ROOMS, [...rooms]);

      const userSockets = users.get(data.userId);

      userSockets.forEach((s) => {
        s.join(room.id);
        s.emit(CREATE_SUCCESS, room.id);
      });
    } else {
      throw "You are already in room (For create room you should left prev room)";
    }
  } catch (e) {
    if (typeof e === "string") {
      socket.emit(CREATE_ERROR, e);
    } else {
      socket.emit(CREATE_ERROR, e?.message || "Occured error");
    }
  }
};

const onJoin = async (socket, data, io, users) => {
  try {
    const { roomId, roomPassword, userId, userName } = data;
    const user = await User.findById(userId);
    let room;

    try {
      room = await Room.findById(roomId);
      if (!room) {
        throw "Not found room";
      }
    } catch {
      throw "Not found room";
    }

    if (user.isUserInRoom) {
      throw "You are already in other room (For enter you should left prev room)";
    }

    if (room.roomPassword !== roomPassword) {
      throw "Invalid Password";
    }

    if (room.owner === userId) {
      room.status = true;
    }

    if (!room.status) {
      throw "Room is not active";
    }

    if (room.users.length >= room.limit) {
      throw "Room is full";
    }

    const userExistInRoom = room.users.find((user) => user.userId === userId);

    if (!userExistInRoom) {
      room.users.push({ userName, userId });
      await room.save();
      const rooms = await getRooms();
      io.emit(GET_ROOMS, [...rooms]);
      const roomInfo = await Room.findById(roomId).select("-roomPassword -__v");
      io.to(roomId).emit(GET_ROOM, roomInfo);
    }

    user.isUserInRoom = true;
    await user.save();

    const userSockets = users.get(userId);

    userSockets.forEach((s) => {
      s.join(roomId);
      s.emit(JOIN_ROOM_SUCCESS, roomId);
    });
  } catch (e) {
    if (typeof e === "string") {
      socket.emit(JOIN_ROOM_ERROR, e);
    } else {
      socket.emit(JOIN_ROOM_ERROR, e?.message || "Error");
    }
  }
};

const onJoinAccess = async (socket, data) => {
  const { roomId } = data;
  socket.join(roomId);
};

const onExit = async ({ roomId, userId }, socket, io, users) => {
  try {
    const user = await User.findById(userId);
    const currentRoom = await Room.findById(roomId).select(
      "-roomPassword -__v"
    );

    if (!currentRoom) throw "Server error";

    const userSockets = users.get(userId);

    if (currentRoom.owner === userId) {
      currentRoom.users = [];
      currentRoom.status = false;

      io.in(roomId).emit(CASE_EXIT);

      userSockets.forEach((s) => s.leave(roomId))

    } else {
      currentRoom.users = currentRoom.users.filter(
        (user) => user.userId !== userId
      );

      userSockets.forEach((s) => s.leave(roomId))
      userSockets.forEach((s) => s.emit(CASE_EXIT))

      socket.in(roomId).emit(GET_ROOM, currentRoom);
    }

    await currentRoom.save();

    const rooms = await getRooms();
    user.isUserInRoom = false;

    await user.save();
  
    io.emit(GET_ROOMS, rooms);
  } catch (e) {}
};

module.exports = { onGetRooms, onCreateRoom, onJoin, onExit, onJoinAccess };
