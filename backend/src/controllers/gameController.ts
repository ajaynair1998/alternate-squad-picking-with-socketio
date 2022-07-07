import { database } from "../db";
import { Request, Response } from "express";
import { IPlayer, IRoom } from "../helpers/interfaces";
import { Namespace } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import socketConnectionController from "./socketConnectionController";
import { delay } from "../helpers";

interface IStartGameParams {
	roomsIo: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
	roomId: string;
	playerOneId: string;
	playerTwoId: string;
	squadForGame?: IPlayer[];
}
let gameController = {
	main: async function (params: IStartGameParams): Promise<any> {
		try {
			// create the room
			await socketConnectionController.create_room();

			for (let i = 0; i < 10; i++) {
				await this.game_loop(params.roomId, params);
			}
		} catch (err) {
			console.log(err);
		}
	},

	game_loop: async function (
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			await gameController.pass_control_to_player_one(roomId, params);
			for (let i = 5; i > 0; i--) {
				await delay(1000);
				await this.change_timer_value(i, roomId, params);
			}
			await gameController.pass_control_to_player_two(roomId, params);
			for (let i = 5; i > 0; i--) {
				await delay(1000);
				await this.change_timer_value(i, roomId, params);
			}
		} catch (err) {
			console.log(err);
		}
	},
	change_timer_value: async function (
		timeLeft: number,
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			let rooms: any = await database.get("rooms");
			if (!rooms) {
				return;
			}
			rooms = JSON.parse(rooms);
			let selectedRoom: IRoom = rooms[roomId];

			selectedRoom.timer = timeLeft;
			rooms[roomId] = selectedRoom;
			await database.set("rooms", JSON.stringify(rooms));
			params.roomsIo
				.to([roomId])
				.emit("current-game-state", { data: selectedRoom });

			return;
		} catch (err) {
			console.log(err);
		}
	},
	pass_control_to_player_one: async function (
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			console.log("\x1b[32m%s\x1b[0m", "player one turn");

			let rooms: any = await database.get("rooms");
			if (!rooms) {
				return;
			}
			rooms = JSON.parse(rooms);

			let selectedRoom: IRoom = rooms[roomId];
			selectedRoom.playerOneTurn = true;
			selectedRoom.playerTwoTurn = false;
			selectedRoom.player_one_actions_available = 1;

			rooms[roomId] = selectedRoom;
			await database.set("rooms", JSON.stringify(rooms));
			params.roomsIo
				.to([roomId])
				.emit("current-game-state", { data: selectedRoom });

			return;
		} catch (err) {
			console.log(err);
		}
	},
	pass_control_to_player_two: async function (
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			console.log("\x1b[32m%s\x1b[0m", "player two turn");
			let rooms: any = await database.get("rooms");
			if (!rooms) {
				return;
			}
			rooms = JSON.parse(rooms);

			let selectedRoom: IRoom = rooms[roomId];
			selectedRoom.playerOneTurn = false;
			selectedRoom.playerTwoTurn = true;
			selectedRoom.player_two_actions_available = 1;

			rooms[roomId] = selectedRoom;
			await database.set("rooms", JSON.stringify(rooms));
			params.roomsIo
				.to([roomId])
				.emit("current-game-state", { data: selectedRoom });

			return;
		} catch (err) {
			console.log(err);
		}
	},
};
export default gameController;
