import express, { Express } from "express";
import dotenv from "dotenv";
import router from "./routes";
import { Server } from "socket.io";
import cors from "cors";
import { database } from "./db";
//initialise connection
database;
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/", router);

let server = app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const io = new Server(server, { cors: { origin: "*" } });

//initializing the socket io connection
io.on("connection", (socket) => {
	console.log("connected to socket ");
	socket.emit("message", "message from server");

	socket.on("join-game", ({ playerName }) => {
		console.log(
			"🚀 ~ file: server.ts ~ line 33 ~ socket.on ~ playerName",
			playerName
		);
		console.log("joined");
		socket.emit("response", {
			data: "some data in response",
		});
	});

	// When a player disconnects
	socket.on("disconnect", () => {
		console.log("disconnected");
	});
});
