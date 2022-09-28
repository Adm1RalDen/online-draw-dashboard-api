const { Router } = require("express");
const { ROOM, USER, AUTH } = require("../const/endpoints");
const roomRouter = require("./room.router");
const userRouter = require("./user.router");
const googleAuthRouter = require("./google.router");
const router = Router();

router.use(ROOM, roomRouter);
router.use(USER, userRouter);
router.use(AUTH, googleAuthRouter);
module.exports = router;
