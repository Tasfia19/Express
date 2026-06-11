import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IProfile } from "./profile.interface";

const createProfileInDB = async (payload: any) => {
	const { user_id, name, email, password, age, gender, phone} =
		payload;

	const hashPass = await bcrypt.hash(password, 10);
	
	const checkUser = await pool.query(`SELECT * FROM users WHERE id=$1`, [
		user_id,
	]);

	if (checkUser.rowCount === 0) {
		throw new Error("User not found");
	}

	const result = await pool.query(
		"INSERT INTO profiles (user_id, name, email, password, age, gender, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
		[user_id, name, email, hashPass, age, gender, phone],
	);
	return result;
};
const getProfile = async (payload: IProfile) => {
	const result = await pool.query(`SELECT * FROM profiles`);
	return result;
};
const getProfileById = async (payload: IProfile, id: string) => {
	const result = await pool.query(`SELECT * FROM profiles WHERE id=$1`, [id]);
	return result;
};

const updateProfileIntoDB = async (payload: IProfile, id: string) => {
	const { name, email, password, age } = payload;
	const result = await pool.query(
		`UPDATE profiles SET 
			name=coalesce($1,name),
			email=coalesce($2,email),
			password=coalesce($3,password),
			age=coalesce($4,age)
			
			WHERE id=$5 RETURNING *`,
		[name, email, password, age, id],
	);
	return result;
};
const deleteProfile = async (payload: IProfile, id: string) => {
	const value = await pool.query(
		`DELETE FROM profiles WHERE id=$1 returning *`,
		[id],
	);
	return value;
};
export const ProfileService = {
	createProfileInDB,
	getProfile,
	getProfileById,
	updateProfileIntoDB,
	deleteProfile,
};
