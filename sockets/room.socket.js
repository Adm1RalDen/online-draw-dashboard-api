const { CreateRoomDB } = require("../db/rooms.operations");
const Room = require("../models/room");
const {
  ROOM: { GET_ROOMS, CREATE_ERROR, CREATE_SUCCESS, JOIN_ERROR, JOIN_SUCCESS },
  USER_ROOM: { GET_ROOM },
  DRAW: { CASE_EXIT }
} = require("../const/sockets");

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
    socket.emit("ERROR", e.message || "Ocurred error");
  }
};

const onCreateRoom = async (socket, data, io) => {
  try {
    const room = await CreateRoomDB(data);
    const rooms = await getRooms();
    socket.join(room.id);
    io.emit(GET_ROOMS, [...rooms]);
    socket.emit(CREATE_SUCCESS, room.id);
  } catch (e) {
    if (typeof e === "string") {
      socket.emit(CREATE_ERROR, e);
    } else {
      socket.emit(CREATE_ERROR, e?.message || "Occured error");
    }
  }
};

const onJoin = async (socket, data, io) => {
  try {
    const { roomId, roomPassword, userId, userName } = data;
    let room;

    try {
      room = await Room.findById(roomId);
      if (!room) {
        throw "Not found room";
      }
    } catch {
      throw "Not found room";
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

    socket.join(roomId);
    socket.emit(JOIN_SUCCESS, roomId);
  } catch (e) {
    if (typeof e === "string") {
      socket.emit(JOIN_ERROR, e);
    } else {
      socket.emit(JOIN_ERROR, e?.message || "Error");
    }
  }
};

const onJoinAccess = async (socket, data) => {
  const { roomId } = data;
  socket.join(roomId);
}

const onExit = async (socket, data, io) => {
  try {
    const { roomId, userId } = data;
    const currentRoom = await Room.findById(roomId).select(
      "-roomPassword -__v"
    );

    if (!currentRoom) throw "Error";

    if (currentRoom.owner === userId) {
      currentRoom.users = [];
      currentRoom.status = false;
      io.in(roomId).emit(CASE_EXIT);
      socket.leave(roomId);
      await currentRoom.save();
    } else {
      currentRoom.users = currentRoom.users.filter(
        (user) => user.userId !== userId
      );
      await currentRoom.save();
      socket.leave(roomId);
      socket.emit(CASE_EXIT);
      socket.in(roomId).emit(GET_ROOM, currentRoom);
    }

    const rooms = await getRooms();
    io.emit(GET_ROOMS, rooms);
  } catch (e) {

  }
};

module.exports = { onGetRooms, onCreateRoom, onJoin, onExit, onJoinAccess };
