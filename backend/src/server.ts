import express, { Express } from "express";
import dotenv from "dotenv";
import router from "./routes";
import { Server } from "socket.io";
import cors from "cors";
import { database } from "./db";
import socketConnectionController from "./controllers/socketConnectionController";
import gameController from "./controllers/gameController";
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
let roomsIo = io.of("/rooms");
let adminIo = io.of("/admin");

// Starting the game room 'room-one'
gameController.main({
	roomsIo: roomsIo,
	roomId: "room-one",
	playerOneId: "player-one",
	playerTwoId: "player-two",
});

roomsIo.on("connection", (socket) => {
	socketConnectionController.main(socket, roomsIo);
});
