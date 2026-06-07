import { pool } from "../../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";


const loginUserIntoDB = async (payload: {
	email: string;
	password: string;
}) => {
	const { email, password } = payload;

	const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [
		email,
	]);
	if (userData.rows.length === 0) {
		throw new Error("Invalid credentials");
	}
	const user = userData.rows[0];
	console.log(user);
	const matchPass = await bcrypt.compare(password, user.password);
	if (!matchPass) {
		throw new Error("password doesn't match");
	}
	const jwtPayload = {
		id: user.id,
		email: user.email,
	};
	const token = jwt.sign(jwtPayload, config.secret as string, {
		expiresIn: "1d",
	});
	return token;

};
export const AuthService = {
	loginUserIntoDB,
};
