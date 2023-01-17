"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.signUp = void 0;
const model_1 = require("./model");
const uuid_1 = require("uuid");
const utility_1 = require("./utils/utility");
const config_1 = require("./config");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        if (typeof req.body === "object" && req.body !== null) {
            const { name, email, password, confirm_password } = req.body;
            const uuiduser = (0, uuid_1.v4)();
            const validateUser = utility_1.UserSchema.validate(req.body, utility_1.option);
            if (validateUser.error) {
                return res.status(400).json({ Error: validateUser.error.details[0].message });
            }
        }
        // generate salt
        const salt = yield (0, utility_1.GenerateSalt)();
        const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
        // generate otp and expiry
        const { otp, expiry } = (0, utility_1.GenerateOtp)();
        console.log(otp, expiry);
        // //  check if user is existing
        const User = yield model_1.UserInstance.findOne({ where: { email: email } });
        if (!User) {
            yield model_1.UserInstance.create({
                id: uuiduser,
                name,
                email,
                password: userPassword,
                salt,
                otp,
                otp_expiry: expiry
            });
            //send otp to user
            const html = (0, utility_1.emailHtml)(otp);
            yield (0, utility_1.mailSent)(config_1.FromAdminMail, email, config_1.userSubject, html);
            //   //check if user exist
            const Users = yield model_1.UserInstance.findOne({ where: { email: email } });
            // Generate a signature
            let signature = yield GenerateSignature({
                id: Users.id,
                email: Users.email,
                verified: Users.verified
            });
            return res.status(201).json({ message: "User created successfully check your email or phone for OTP verification"
            });
        }
        return res.status(400).json({ Error: "user already exist" });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/signup",
        });
    }
});
exports.signUp = signUp;
/** ==============Login user============= **/
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateUser = utility_1.loginSchema.validate(req.body, utility_1.option);
        if (validateUser.error) {
            return res.status(400).json({
                Error: validateUser.error.details[0].message
            });
        }
        const User = yield model_1.UserInstance.findOne({ where: { email: email } });
        if (User) {
            const validation = yield (0, utility_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                // Generate signature for user
                let signature = yield GenerateSignature({
                    id: User.id,
                    email: User.email,
                    verified: User.verified
                });
                return res.status(200).json({ message: "You are successfully logged in",
                    email: User.email,
                });
            }
        }
        return res.status(400).json({ Error: "wrong username or password" });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login",
        });
    }
});
exports.Login = Login;
function GenerateSignature(arg0) {
    throw new Error("Function not implemented.");
}
