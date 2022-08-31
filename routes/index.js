const { Router } = require("express");
const { ROOM, USER } = require("../const/endpoints");
const roomRouter = require("./room.router");
const userRouter = require("./user.router");
const router = Router();

router.use(ROOM, roomRouter)
router.use(USER, userRouter)

module.exports = router;
