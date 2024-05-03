"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const motivationLinks_1 = __importDefault(require("@/controller/motivationController/motivationLinks"));
router.get("/:boxId/ids", motivationLinks_1.default.getMotivationLinkIds);
router.post("/:boxId", motivationLinks_1.default.createMotivationLink);
router.delete("/:boxId/:motivationLinkId", motivationLinks_1.default.removeMotivationLink);
exports.default = router;
