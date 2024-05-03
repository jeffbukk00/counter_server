"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const motivationLink_1 = __importDefault(require("@/controller/motivationController/motivationLink"));
router.get("/:motivationLinkId", motivationLink_1.default.getMotivationLink);
router.put("/:motivationLinkId", motivationLink_1.default.editMotivationLink);
exports.default = router;
