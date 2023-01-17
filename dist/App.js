"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = __importDefault(require("./route/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Database connection
config_1.db.sync().then(() => {
    console.log("db connected succcessfully");
}).catch((error) => {
    console.log(error);
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use('/users', user_1.default);
app.listen(port, () => {
    console.log(`server running on http://localhost: ${port}`);
});
exports.default = app;
