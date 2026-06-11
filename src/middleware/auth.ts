import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Roles } from "../types";



export const auth = (...roles: Roles[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			console.log(roles);
			// console.log("this is protected");
			const token = req.headers.authorization;
			console.log("token:", token);
			if (!token) {
				res.status(404).json({
					success: false,
					message: "Unauthorized access",
				});
			}
			const decoded = jwt.verify(
				token as string,
				config.secret as string,
			) as JwtPayload;
			// console.log(decoded);

			const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
				decoded.email,
			]);
			const user = userData.rows[0];
			// console.log("Userdata:",user);
			if (userData.rows.length === 0) {
				res.status(404).json({
					success: true,
					message: "User not found",
				});
			}

			req.user = decoded;

			if (roles.length && !roles.includes(user.role)) {
				res.status(404).json({
					success: false,
					message: "Forbidden!!!!!! User has no access",
				});
			}

			next();
		} catch (error) {
			next(error);
			
		}
	};
};


export const authProfile = () => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// console.log("this is protected");
			const token = req.headers.authorization;
			if (!token) {
				res.status(404).json({
					success: false,
					message: "Unauthorized access",
				});
			}
			const decoded = jwt.verify(
				token as string,
				config.secret as string,
			) as JwtPayload;
			// console.log(decoded);

			const userData = await pool.query(`SELECT * FROM profiles WHERE email=$1`, [
				decoded.email,
			]);
			const user = userData.rows[0];
			// console.log("Userdata:",user);
			if (userData.rows.length === 0) {
				res.status(404).json({
					success: true,
					message: "profile not found",
				});
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};




// steps

// [Incoming Request] 
//        │
//        ▼
//  1. Extract Token ──► (Missing? 404 Unauthorized)
//        │
//        ▼
//  2. Verify JWT    ──► (Invalid/Expired? Throws error to Catch block)
//        │
//        ▼
//  3. DB Check      ──► (Not Found? 404 User/Profile Not Found)
//        │
//        ▼
//  4. Role Check    ──► (Unauthorized Role? 404 Forbidden)
//        │
//        ▼
//  [Call next()]    ──► (Moves to your actual route controller)