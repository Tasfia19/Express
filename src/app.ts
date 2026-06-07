import express, { type Application } from "express";

import { userRouter } from "./modules/user/user.route";
import { profileRouter } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import fs from "fs";

const app: Application = express();

//its a middleware that dont need body parsing it reads data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //nested data neyar jnne extended true
app.use(express.text()); //test format a neyar jnne

//middleware
app.use((req, res, next) => {
	console.log("Time:", Date.now(), "MEthod:", req.method, "Url:", req.url);
	//logger
	const log = `Method--> ${req.method} Time-->${Date.now()} Url-->${req.url}`;
	fs.appendFile("logger.txt", log, (err) => {
		console.log(err);
	});
	console.log(log);
	next();
});

//all get
app.use("/api", userRouter);

//by id
app.use("/api/:id", userRouter);

//post
app.use("/api/user", userRouter);

//update
app.use("/api/user/:id", userRouter);
//delete
app.use("/api/user/:id", userRouter);

///for profile

app.use("/profile", profileRouter);

//for auth
app.use("/auth", authRouter);
export default app;
