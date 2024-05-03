"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const motivations_1 = __importDefault(require("@/controller/motivationController/motivations"));
router.get("/:boxId/ids", motivations_1.default.getMotivationIds);
router.post("/:boxId/text", motivations_1.default.createMotivationText);
router.post("/:boxId/link", motivations_1.default.createMotivationLink);
router.delete("/:boxId/:motivationId", motivations_1.default.removeMotivation);
exports.default = router;
