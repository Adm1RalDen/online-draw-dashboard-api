const router = require("express").Router();
const RoomController = require("../controllers/room.controller");
const {
  ROOM_ENDPOINTS: {
    ALL_ROOMS_URL,
    CHECK_PASSWORD_URL,
    CHECK_ROOM_URL,
    CREATE_ROOM_URL,
    ENTER_ROOM_URL,
    LEAVE_URL,
  },
} = require("../const/endpoints");

router.post(CREATE_ROOM_URL, RoomController.createRoom);
router.post(ENTER_ROOM_URL, RoomController.enterInRoom);
router.get(ALL_ROOMS_URL, RoomController.getAllRooms);
router.post(CHECK_ROOM_URL, RoomController.checkIdRoom);
router.put(LEAVE_URL, RoomController.exitFromRoom);
router.post(CHECK_PASSWORD_URL, RoomController.checkRoomPassword);

module.exports = router;
