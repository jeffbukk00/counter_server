import { Router } from "express";

const router = Router();

import authMainControllers from "@/controller/authController/authMain";

router.get("/logged-in", authMainControllers.checkLoggedIn);
router.post("/logout", authMainControllers.logout);

export default router;
