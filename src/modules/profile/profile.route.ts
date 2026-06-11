import { Router } from "express";
import { profileController } from "./profile.controller";
import  { authProfile } from "../../middleware/auth";

const router = Router();

router.post("/", profileController.createProfile);
router.get("/all", authProfile(), profileController.getAllProfile);
router.get("/:id", profileController.getProfileByID);
router.put("/:id", profileController.updateProfile);
router.delete("/:id", profileController.deleteProfile);
export const profileRouter = router;
