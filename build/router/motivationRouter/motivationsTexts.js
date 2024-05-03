"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const motivationTexts_1 = __importDefault(require("@/controller/motivationController/motivationTexts"));
router.get("/:boxId/ids", motivationTexts_1.default.getMotivationTextIds);
router.post("/:boxId", motivationTexts_1.default.createMotivationText);
router.delete("/:boxId/:motivationTextId", motivationTexts_1.default.removeMotivationText);
exports.default = router;
