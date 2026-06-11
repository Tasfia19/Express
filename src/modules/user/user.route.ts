import { Router } from "express";

import { UserController } from "./user.controller";

import { User_Roles } from "../../types";
import { auth } from "../../middleware/auth";

const router = Router();



//for get method all
// router.get("/", auth("admin"), UserController.getAllUser);
router.get("/", auth(User_Roles.admin), UserController.getAllUser);

//for get by id
router.get("/:id", UserController.getUserById);

//for add or post method
router.post("/", UserController.createUser);

//for update
router.put("/:id", UserController.updateUser);
//for delete
router.delete("/:id", UserController.deleteUser);

export const userRouter = router;
