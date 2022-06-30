import express = require("express");
import authController from "../controllers/authController";
const router = express.Router();
router.post("/log-in", authController.post);

export default router;
