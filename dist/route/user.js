"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller/controller");
const Auth_1 = require("../middleware/Auth");
const router = express_1.default.Router();
router.post('/signup', controller_1.signUp);
router.post('/verify/:signature', controller_1.verifyUser);
router.get('/resend-otp/:signature', controller_1.resendOTP);
router.post('/login', controller_1.Login);
router.get('/dashboard', Auth_1.auth, controller_1.getUser);
exports.default = router;
