"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_1 = __importDefault(require("@/controller/userController/user"));
router.get("/user-data", user_1.default.getUserData);
// router.patch("/user-data/user-profile", userController.updateUserProfile);
router.patch("/user-data/unread-positive-popup-ids", user_1.default.updateUnreadPositivePopupIds);
exports.default = router;
