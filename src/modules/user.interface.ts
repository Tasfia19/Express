// 1. Export the enum and capitalize the name
export enum UserRole {
	ADMIN = "admin",
	USER = "user",
}

export interface IUser {
	name: string;
	email: string;
	password: string;
	age: number;
	// 2. Update the reference here
	role?: UserRole;
}
