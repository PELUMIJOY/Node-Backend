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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.emailHtml = exports.mailSent = exports.GenerateOtp = exports.validatePassword = exports.GenerateSignature = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.loginSchema = exports.UserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
// Users Signup
exports.UserSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: joi_1.default.string().equal(joi_1.default.ref('password')).required().label('confirm password').messages({ 'any.only': '{{#label}} does not match' })
});
//Users login
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
exports.option = {
    abortearly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
const GenerateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: '1d' });
});
exports.GenerateSignature = GenerateSignature;
// export const validatePassword= async (Password: string | Buffer) =>{
//         const hash = await bcrypt.hash(Password, 10);
//         // Store hash in the database
//     }
//      
//     // compare password
//    export  const comparePassword= async (Password: string | Buffer, hash: string)=> {
//         const result = await bcrypt.compare(Password, hash);
//         return result;
//     }
// validate password
const validatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
});
exports.validatePassword = validatePassword;
const GenerateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 900000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
// send otp to email
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: config_1.GMAIL_USER,
        pass: config_1.GMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
// export const sendEmail = () => {
// }
// create function to help send mail
const mailSent = (from, to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield transport.sendMail({
            from: config_1.FromAdminMail,
            to,
            subject: config_1.userSubject,
            html,
        });
        return response;
    }
    catch (error) {
        console.log(error);
    }
});
exports.mailSent = mailSent;
const emailHtml = (otp) => {
    let response = ` <div style="max-width:700px;
          margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%;">
  
          <h2 style="text-align:center; text-transform:uppercase; color:teal;">
          Welcome to Pelum's Technologies
          </h2>
  
          <p style="padding:50px; margin:2Opx;"> DO NOT DISCLOSE, verify your account with this  OTP ${otp}. It expires in 30minutes</p>
  
          </div>`;
    return response;
};
exports.emailHtml = emailHtml;
const verifySignature = (signature) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.verify(signature, config_1.APP_SECRET);
});
exports.verifySignature = verifySignature;
