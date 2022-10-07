const { Router } = require("express");
const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  USER_ENDPOINTS: {
    ACTIVATION_LINK_URL,
    GET_USER_URL,
    LOGIN_URL,
    LOGOUT_URL,
    REFRESH_URL,
    REGISTRATION_URL,
    UPDATE_URL,
    VERIFY_2FA_URL,
  },
} = require("../const/endpoints");
const { use2FAmiddleware } = require("../middlewares/use2FA.middleware");
const router = Router();

router.post(VERIFY_2FA_URL, UserController.verify2FA);
router.post(REGISTRATION_URL, UserController.registration);
router.post(LOGIN_URL, use2FAmiddleware, UserController.login);
router.delete(LOGOUT_URL, UserController.logout);
router.get(ACTIVATION_LINK_URL, UserController.activate);
router.post(REFRESH_URL, UserController.handleRefresh);
router.get(GET_USER_URL, authMiddleware, UserController.getUser);
router.put(UPDATE_URL, authMiddleware, UserController.updateUserData);
module.exports = router;
