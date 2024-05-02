"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const authMain_1 = __importDefault(require("@/controller/authController/authMain"));
router.get("/logged-in", authMain_1.default.checkLoggedIn);
router.post("/logout", authMain_1.default.logout);
exports.default = router;
