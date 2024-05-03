"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const motivationText_1 = __importDefault(require("@/controller/motivationController/motivationText"));
router.get("/:motivationTextId", motivationText_1.default.getMotivationText);
router.put("/:motivationTextId", motivationText_1.default.editMotivationText);
exports.default = router;
