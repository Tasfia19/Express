import express, { type Application } from "express";

import { userRouter } from "./modules/user/user.route";
import { profileRouter } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

//its a middleware that dont need body parsing it reads data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //nested data neyar jnne extended true
app.use(express.text()); //text format a neyar jnne
app.use(cookieParser());
//middleware
app.use(logger);

const corsOptions = {
	origin: "http://localhost:5000",
};
app.use(cors(corsOptions));

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

app.use("/profile/all", profileRouter);

app.use("/profile/:id", profileRouter);



//for auth
app.use("/auth", authRouter);
app.use("/auth/profile",authRouter)


//global console.error
app.use(globalErrorHandler);




export default app;
