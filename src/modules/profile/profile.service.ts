import { pool } from "../../db";

const createProfileInDB = async (payload: any) => {
	const { user_id, name, age, gender, phone, bio, location } = payload;

	const checkUser = await pool.query(`SELECT * FROM users WHERE id=$1`, [user_id]);

	if (checkUser.rowCount === 0) {
		throw new Error("User not found");
	}

	const result = await pool.query(
		"INSERT INTO profiles (user_id, name, age, gender, phone, bio, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
		[user_id, name, age, gender, phone, bio, location]
	);
	return result;
};

export const ProfileService = {
	createProfileInDB,
};
