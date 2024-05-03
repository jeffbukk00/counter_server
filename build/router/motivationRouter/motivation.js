"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const motivation_1 = __importDefault(require("@/controller/motivationController/motivation"));
router.get("/:motivationId", motivation_1.default.getMotivation);
router.put("/text/:motivationId", motivation_1.default.editMotivationText);
router.put("/link/:motivationId", motivation_1.default.editMotivationLink);
exports.default = router;
