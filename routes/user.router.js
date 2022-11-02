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
    CREATE_2FA,
    CONFIRM_CREATING_2FA,
    SEND_CODE_ON_MAIL,
    DISABLE_2FA,
  },
} = require("../const/endpoints");

const router = Router();

router.post(VERIFY_2FA_URL, UserController.verify2FA);
router.post(REGISTRATION_URL, UserController.registration);
router.get(ACTIVATION_LINK_URL, UserController.activate);
router.post(REFRESH_URL, UserController.handleRefresh);
router.post(LOGIN_URL, UserController.login);
router.delete(LOGOUT_URL, UserController.logout);

router.get(SEND_CODE_ON_MAIL, authMiddleware, UserController.send2FaCodeOnEmail);
router.post(CONFIRM_CREATING_2FA, authMiddleware, UserController.confirmCreating2Fa);
router.post(DISABLE_2FA, authMiddleware, UserController.disable2Fa);
router.put(UPDATE_URL, authMiddleware, UserController.updateUserData);
router.get(CREATE_2FA, authMiddleware, UserController.create2Fa);
router.get(GET_USER_URL, authMiddleware, UserController.getUser);

module.exports = router;
