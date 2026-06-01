import { pool } from "../../db";
import type { IUser } from "../user.interface";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: IUser) => {
	const { name, email, password, age } = payload;

	const hashPass = await bcrypt.hash(password, 10);

	const result = await pool.query(
		`INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4)
        RETURNING *`,
		[name, email, hashPass, age],
	);
	delete result.rows[0].password; //for removing password field
	return result;
};

const getAllUserFromDB = async (payload: IUser) => {
	const result = await pool.query(`SELECT * FROM users`);
	return result;
};

const getUserByIdFromDB = async (payload: IUser, id: string) => {
	const result = await pool.query(
		`SELECT * FROM users
            WHERE id=$1`,
		[id],
	);
	return result;
};

const updateUserIntoDB = async (payload: IUser, id: string) => {
	const { name, email, password, age } = payload;
	const result = await pool.query(
		`UPDATE users SET 
            name=coalesce($1,name),
            email=coalesce($2,email),
            password=coalesce($3,password),
            age=coalesce($4,age)
            
            WHERE id=$5 RETURNING *`,
		[name, email, password, age, id],
	);
	return result;
};
const deleteUserFromDB = async (id: string) => {
	const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
		id,
	]);
	return result;
};

export const UserService = {
	createUserIntoDB,
	getAllUserFromDB,
	getUserByIdFromDB,
	updateUserIntoDB,
	deleteUserFromDB,
};
