import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/", AuthController.loginUser);
router.post("/refreshtoken", AuthController.refreshToken);

router.post("/profile", AuthController.loginProfile);


export const authRouter = router;
