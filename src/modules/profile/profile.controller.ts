import express, { type Request, type Response } from "express";
import { ProfileService } from "./profile.service";
import sendResponse from "../../utility/sendResponse";

const createProfile = async (req: Request, res: Response) => {
	try {
		const result = await ProfileService.createProfileInDB(req.body);

		res.status(201).json({
			success: true,
			message: "Profile created successfully",
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

const getAllProfile = async (req: Request, res: Response) => {
	try {
		const value = await ProfileService.getProfile(req.body);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "All Profile retrieved successfully",
			data: value.rows,
		});
	} catch (error: any) {
		sendResponse(res, {
			statusCode: 500,
			success: false,
			message: error.message,
			error: error,
		});
	}
};

const getProfileByID = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		const value = await ProfileService.getProfileById(req.body, id as string);
		if (value.rows.length === 0) {
			res.status(404).json({
				success: false,
				message: "User not found",
				data: {},
			});
		}
		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "User Profile retrieved successfully",
			data: value.rows[0],
		});
	} catch (error: any) {
		sendResponse(res, {
			statusCode: 500,
			success: false,
			message: error.message,
			error: error,
		});
	}
};
const updateProfile = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		const value = await ProfileService.updateProfileIntoDB(
			req.body,
			id as string,
		);
		if (value.rows.length === 0) {
			sendResponse(res, {
				statusCode: 404,
				success: false,
				message: "User not found",
				data: {},
			});
		}
		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "User Profile updated successfully",
			data: value.rows[0],
		});
	} catch (error: any) {
		sendResponse(res, {
			statusCode: 500,
			success: false,
			message: error.message,
			error: error,
		});
	}
};


const deleteProfile = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		const value = await ProfileService.deleteProfile(
			req.body,
			id as string,
		);
		if (value.rows.length === 0) {
			sendResponse(res, {
				statusCode: 404,
				success: false,
				message: "User not found",
				data: {},
			});
		}
		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "User Profile deleted successfully",
			data: value.rows[0],
		});
	} catch (error: any) {
		sendResponse(res, {
			statusCode: 500,
			success: false,
			message: error.message,
			error: error,
		});
	}
};
export const profileController = {
	createProfile,
	getAllProfile,
	getProfileByID,
	updateProfile,
	deleteProfile,
};
