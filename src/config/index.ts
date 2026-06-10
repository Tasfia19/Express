import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
	path: path.join(process.cwd(), ".env"),
});

const config = {
	connection_string: process.env.CONNECTION_STRING as string,
	port: process.env.PORT,
	secret: process.env.JWT_SECRET,
	Refresh_Secret: process.env.JWT_REFRESH_SECRET,
	accessExpire: process.env.access_expires as any,
	refreshExpire: process.env.refresh_expires as any,
};
export default config;
