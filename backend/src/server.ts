import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server started");
});

app.use("/", router);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
