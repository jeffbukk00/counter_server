"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const confirmAuthorized_1 = __importDefault(require("@/middlewares/confirmAuthorized"));
const router = (0, express_1.Router)();
const user_1 = __importDefault(require("@/controller/userController/user"));
router.use("/", confirmAuthorized_1.default);
router.get("/user-data", user_1.default.getUserData);
router.patch("/user-data/user-profile", user_1.default.updateUserProfile);
router.patch("/user-data/unread-positive-popup-ids", user_1.default.updateUnreadPositivePopupIds);
exports.default = router;
