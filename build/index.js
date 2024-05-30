"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 디렉토리 루트에 존재하는 .env 파일에 대한 설정.
// 프로젝트 내에서 환경변수 사용 가능해짐.
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_1 = require("./constants/client");
// 데이터베이스 연결
// ODM으로 mongoose 사용
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./constants/db");
mongoose_1.default
    .connect(db_1.MONGO_CONNECTION_URL)
    .then(() => console.log("Mongo connection is opened"))
    .catch((error) => {
    console.log("Mongo connection is failed");
    console.log(error);
});
// 서버 어플리케이션 초기화
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// 모든 미들웨어들에 대한 기본 설정들.
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const corsConfig = {
    origin: client_1.CLIENT_HOST,
    credentials: true,
};
app.use((0, cors_1.default)(corsConfig));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// 모든 라우터들 임포트.
const authMain_1 = __importDefault(require("@/router/authRouter/authMain"));
const google_1 = __importDefault(require("@/router/authRouter/oauthRouter/google"));
const kakao_1 = __importDefault(require("@/router/authRouter/oauthRouter/kakao"));
const naver_1 = __importDefault(require("@/router/authRouter/oauthRouter/naver"));
const user_1 = __importDefault(require("@/router/userRouter/user"));
const buckets_1 = __importDefault(require("@/router/bucketRouter/buckets"));
const bucket_1 = __importDefault(require("@/router/bucketRouter/bucket"));
const counters_1 = __importDefault(require("@/router/counterRouter/counters"));
const counter_1 = __importDefault(require("@/router/counterRouter/counter"));
const motivationsTexts_1 = __importDefault(require("@/router/motivationRouter/motivationsTexts"));
const motivationText_1 = __importDefault(require("@/router/motivationRouter/motivationText"));
const motivationLinks_1 = __importDefault(require("@/router/motivationRouter/motivationLinks"));
const motivationLink_1 = __importDefault(require("@/router/motivationRouter/motivationLink"));
const shareLink_1 = __importDefault(require("@/router/shareLinkRouter/shareLink"));
// 유저 인증에 대한 라우터
app.use("/auth", authMain_1.default, google_1.default, kakao_1.default, naver_1.default);
// 접근 권한을 확인하는 미들웨어.
// 위의 유저 인증에 대한 라우터를 제외하고는 전부 이를 거침.
const confirmAuthorized_1 = __importDefault(require("@/middlewares/confirmAuthorized"));
app.use("/", confirmAuthorized_1.default);
// 유저에 대한 라우터.
app.use("/user", user_1.default);
// 버킷에 대한 라우터들.
app.use("/buckets", buckets_1.default);
app.use("/bucket", bucket_1.default);
// 카운터에 대한 라우터들.
app.use("/counters", counters_1.default);
app.use("/counter", counter_1.default);
// 모티베이션에 대한 라우터들.
app.use("/motivation-texts", motivationsTexts_1.default);
app.use("/motivation-text", motivationText_1.default);
app.use("/motivation-links", motivationLinks_1.default);
app.use("/motivation-link", motivationLink_1.default);
// 공유 링크에 대한 라우터.
app.use("/sharing", shareLink_1.default);
// 404(not-found) 에러에 대한 에러 처리 경로.
const errorWrapper_1 = require("./error/errorWrapper");
const HttpError_1 = require("./error/HttpError");
app.use("/", (0, errorWrapper_1.errorWrapper)(() => {
    throw new HttpError_1.HttpError(404, { message: "Requested path was not found" });
}));
// 어플리케이션 내 모든 에러들을 중앙 처리하는 기본 에러 처리 경로.
const defaultErrorMiddleware_1 = require("./error/defaultErrorMiddleware");
app.use(defaultErrorMiddleware_1.defaultErrorMiddleware);
// 서버 실행.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
