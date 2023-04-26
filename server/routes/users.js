import express from "express";
import { usersController } from "../controllers/users.js";

const router = express.Router();

const { usersRegister, userVerification } = usersController;

router.post("/", usersRegister);

router.get("/:id/verify", userVerification);

export default router;
