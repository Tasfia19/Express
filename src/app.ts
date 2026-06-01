import express, { type Application } from "express";

import { userRouter } from "./modules/user/user.route";
import { profileRouter } from "./modules/profile/profile.route";

const app: Application = express();

//its a middleware that dont need body parsing it reads data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //nested data neyar jnne extended true
app.use(express.text()); //test format a neyar jnne

//all get
app.use("/api", userRouter);

//by id
app.use("/api/:id", userRouter);

//post
app.use("/user", userRouter);

//update
app.use("/api/user/:id", userRouter);
//delete
app.use("/api/user/:id", userRouter);

///for profile

app.use("/profile", profileRouter);

export default app;
