import { UserRole } from "./../user.interface";
import { pool } from "../../db";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
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
	// console.log(user);
	const matchPass = await bcrypt.compare(password, user.password);
	if (!matchPass) {
		throw new Error("password doesn't match");
	}
	const jwtPayload = {
		id: user.id,
		email: user.email,
		role: user.role,
	};
	console.log(jwtPayload);

	const accessToken = jwt.sign(jwtPayload, config.secret as string, {
		expiresIn: config.accessExpire,
	});

	const refreshToken = jwt.sign(jwtPayload, config.Refresh_Secret as string, {
		expiresIn: config.refreshExpire,
	});
	return { accessToken, refreshToken };
};

const loginProfileIntoDB = async (payload: {
	email: string;
	password: string;
}) => {
	const { email, password } = payload;

	const profileData = await pool.query(
		`SELECT * FROM profiles WHERE email = $1`,
		[email],
	);
	
	if (profileData.rows.length === 0) {
		throw new Error("Invalid credentials");
	}
	const user = profileData.rows[0];

	const matchPass = await bcrypt.compare(password, user.password);

	
	if (!matchPass) {
		throw new Error("password doesn't match");
	}
	const jwtPayload = {
		id: user.id,
		email: user.email,
		role: user.role,
	};
	console.log(jwtPayload);

	const accessToken = jwt.sign(jwtPayload, config.secret as string, {
		expiresIn: config.accessExpire,
	});

	const refreshToken = jwt.sign(jwtPayload, config.Refresh_Secret as string, {
		expiresIn: config.refreshExpire,
	});
	return { accessToken, refreshToken };
};

const generateRefreshToken = async (token: string) => {
	try {
		if (!token) {
			throw new Error("Unauthorized access");
		}
		const decoded = jwt.verify(
			token as string,
			config.Refresh_Secret as string,
		) as JwtPayload;

		const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
			decoded.email,
		]);
		const user = userData.rows[0];

		if (userData.rows.length === 0) {
			throw new Error("User not found");
		}
		const jwtPayload = {
			id: user.id,
			email: user.email,
			role: user.role,
		};
		console.log(jwtPayload);

		const accessToken = jwt.sign(jwtPayload, config.secret as string, {
			expiresIn: "1d",
		});
		return { accessToken };
	} catch (error) {
		console.log(error);
	}
};
export const AuthService = {
	loginUserIntoDB,
	generateRefreshToken,
	loginProfileIntoDB,
};
