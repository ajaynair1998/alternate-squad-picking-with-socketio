import express = require("express");
import authController from "../controllers/authController";
import gameController from "../controllers/gameController";
const router = express.Router();
router.post("/log-in", authController.post);
router.post("/start-game", gameController.main);

export default router;
