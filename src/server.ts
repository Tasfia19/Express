import express, {
	type Application,
	type Request,
	type Response,
} from "express";

import { Pool } from "pg";
import config from "./config";

const app: Application = express();
const port = config.port;

const pool = new Pool({
	connectionString: config.connection_string,
});

//function Initialize to create conncetion or pool between server & cloud database

const initDB = async () => {
	try {
		await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20) UNIQUE NOT NULL,
            password VARCHAR(20) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
		console.log("Database Connection Successful!");
	} catch (error) {
		console.log(error);
	}
};
initDB();

//its a middleware that dont need body parsing it reads data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //nested data neyar jnne extended true
app.use(express.text()); //test format a neyar jnne

//for all
app.get("/", async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`SELECT * FROM users`);
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
});
//for single get
app.get("/:id", async (req: Request, res: Response) => {
	const id = req.params.id;
	console.log(id);
	try {
		const result = await pool.query(
			`SELECT * FROM users
            WHERE id=$1`,
			[id],
		);
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
});

//for add
app.post("/user", async (req: Request, res: Response) => {
	// console.log(req.body);
	const { name, email, password, age } = req.body;
	try {
		const result = await pool.query(
			`INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4)
        RETURNING *`,
			[name, email, password, age],
		);
		// console.log(result);

		res.status(201).json({
			message: "User created Successfully",
			// data: body //ja dbo tai dekabe
			//
			data: result.rows[0],
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
			error: error,
		});
	}
});

//update
app.put("/user/:id", async (req: Request, res: Response) => {
	//   console.log(req.body);
	const { name, email, password, age } = req.body;

	const id = req.params.id;

	try {
		//using coalesce will keep the value the default as it is wont chnge to null or undefinwed
		const result = await pool.query(
			`UPDATE users SET 
            name=coalesce($1,name),
            email=coalesce($2,email),
            password=coalesce($3,password),
            age=coalesce($4,age)
            
            WHERE id=$5 RETURNING *`,
			[name, email, password, age, id],
		);
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
});
//delete
app.delete("/user/:id", async (req: Request, res: Response) => {
	//   console.log(req.body);

	const id = req.params.id;

	try {
		//using coalesce will keep the value the default as it is wont chnge to null or undefinwed
		const result = await pool.query(
			`DELETE FROM users WHERE id=$1 RETURNING *`,
			[id],
		);
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
});
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
