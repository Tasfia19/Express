import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
	// console.log(req.body);
	// const { name, email, password, age } = req.body;
	try {
		const result = await UserService.createUserIntoDB(req.body);

		res.status(201).json({
			success: true,
			message: "User created Successfully",
			data: result.rows[0],
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
			error: error,
		});
	}
};

const getAllUser = async (req: Request, res: Response) => {
	try {
		const result = await UserService.getAllUserFromDB(req.body);
		res.status(200).json({
			message: "User retrievedSuccessfully",
			data: result.rows,
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
			error: error,
		});
	}
};

const getUserById = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		const result = await UserService.getUserByIdFromDB(req.body, id as string);
		if (result.rows.length === 0) {
			res.status(404).json({
				success: false,
				message: "User not found",
				data: {},
			});
		}
		res.status(200).json({
			success: true,
			message: "User info retrieved Successfully",
			data: result.rows[0],
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
			error: error,
		});
	}
};
const updateUser = async (req: Request, res: Response) => {
	//   console.log(req.body);
	const { name, email, password, age } = req.body;

	const id = req.params.id;

	try {
		//using coalesce will keep the value the default as it is wont chnge to null or undefinwed
		const result =await UserService.updateUserIntoDB(req.body, id as string);
		// console.log(result);
		if (result.rows.length === 0) {
			res.status(404).json({
				message: "User not found",
				data: {},
			});
		}
		res.status(200).json({
			message: "User updated Successfully",
			data: result.rows[0],
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
			error: error,
		});
	}
};

const deleteUser = async (req: Request, res: Response) => {

	const id = req.params.id;

	try {
		//using coalesce will keep the value the default as it is wont chnge to null or undefinwed
		const result =await UserService.deleteUserFromDB(id as string);
		// console.log(result);
		if (result.rows.length === 0) {
			res.status(404).json({
				message: "User not found",
				data: {},
			});
		}
		res.status(200).json({
			message: "User deleted Successfully",
			data: {},
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
			error: error,
		});
	}
};
export const UserController = {
	createUser,
	getAllUser,
	getUserById,
	updateUser,
	deleteUser
};
