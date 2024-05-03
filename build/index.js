"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_TEST_URL;
console.log(MONGO_CONNECTION_URL);
mongoose_1.default
    .connect(MONGO_CONNECTION_URL)
    .then(() => console.log("Mongo connection is opened"))
    .catch((error) => {
    console.log("Mongo connection is failed");
    console.log(error);
});
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const corsConfig = {
    origin: process.env.CLIENT_HOST,
    credentials: true,
};
app.use((0, cors_1.default)(corsConfig));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const authMain_1 = __importDefault(require("@/router/authRouter/authMain"));
const google_1 = __importDefault(require("@/router/authRouter/oauthRouter/google"));
const kakao_1 = __importDefault(require("@/router/authRouter/oauthRouter/kakao"));
const naver_1 = __importDefault(require("@/router/authRouter/oauthRouter/naver"));
const user_1 = __importDefault(require("@/router/userRouter/user"));
const buckets_1 = __importDefault(require("@/router/bucketRouter/buckets"));
const bucket_1 = __importDefault(require("@/router/bucketRouter/bucket"));
const counters_1 = __importDefault(require("@/router/counterRouter/counters"));
const counter_1 = __importDefault(require("@/router/counterRouter/counter"));
const confirmAuthorized_1 = __importDefault(require("@/middlewares/confirmAuthorized"));
app.use("/auth", authMain_1.default, google_1.default, kakao_1.default, naver_1.default);
// 권한 확인
app.use("/", confirmAuthorized_1.default);
app.use("/user", user_1.default);
app.use("/buckets", buckets_1.default);
app.use("/bucket", bucket_1.default);
app.use("/counters", counters_1.default);
app.use("/counter", counter_1.default);
const errorWrapper_1 = require("./error/errorWrapper");
const HttpError_1 = require("./error/HttpError");
app.use("/", (0, errorWrapper_1.errorWrapper)(() => {
    throw new HttpError_1.HttpError(404, { message: "Requested path was not found" });
}));
const defaultErrorMiddleware_1 = require("./error/defaultErrorMiddleware");
app.use(defaultErrorMiddleware_1.defaultErrorMiddleware);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
