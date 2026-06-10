import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Roles } from "../types";

const auth = (...roles: Roles[]) => {
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

export default auth;
