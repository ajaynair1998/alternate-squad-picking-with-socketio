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

			for (let i = 0; i < 6; i++) {
				await this.game_loop(params.roomId, params);
			}
			// there will be a player not selected if we dont check after the loop is completed
			await gameController.assign_player_automatically_if_unresponsive(
				params.playerTwoId,
				params.roomId,
				params
			);
			await gameController.change_game_state_to_completed(
				params.roomId,
				params
			);
		} catch (err) {
			console.log(err);
		}
	},

	game_loop: async function (
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			await gameController.assign_player_automatically_if_unresponsive(
				params.playerTwoId,
				roomId,
				params
			);
			await gameController.pass_control_to_player_one(roomId, params);
			for (let i = 5; i >= 0; i--) {
				let actionsLeft = await gameController.check_if_actions_left(
					params.playerOneId,
					roomId,
					params
				);
				if (actionsLeft) {
					await delay(1000);
					await this.change_timer_value(i, roomId, params);
				}
			}
			await gameController.assign_player_automatically_if_unresponsive(
				params.playerOneId,
				roomId,
				params
			);
			await gameController.pass_control_to_player_two(roomId, params);
			for (let i = 5; i >= 0; i--) {
				let actionsLeft = await gameController.check_if_actions_left(
					params.playerTwoId,
					roomId,
					params
				);
				if (actionsLeft) {
					await delay(1000);
					await this.change_timer_value(i, roomId, params);
				}
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
	assign_player_automatically_if_unresponsive: async function (
		playerId: string,
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			let rooms: any = await database.get("rooms");
			if (!rooms) {
				return;
			}
			rooms = JSON.parse(rooms);
			let roomToBeSelected = rooms[roomId];
			let selectedRoom: IRoom = { ...roomToBeSelected };

			if (selectedRoom.playerOneId === playerId) {
				if (selectedRoom.player_one_actions_available > 0) {
					let sortable: [string, IPlayer][] = [];
					for (const playerId in selectedRoom.playersAvailable) {
						sortable.push([playerId, selectedRoom.playersAvailable[playerId]]);
					}
					sortable.sort((a: any, b: any) => b[1].points - a[1].points);
					let idOfPlayerWithMaxPoints = sortable[0][0];
					let maxPlayerDetails = sortable[0][1];

					// now add this player to player one's squad and delete it from the pool
					selectedRoom.playerOneSquad[idOfPlayerWithMaxPoints] =
						maxPlayerDetails;
					delete selectedRoom.playersAvailable[idOfPlayerWithMaxPoints];

					rooms[roomId] = selectedRoom;
					await database.set("rooms", JSON.stringify(rooms));
				} else {
					return;
				}
			} else if (selectedRoom.playerTwoId === playerId) {
				if (selectedRoom.player_two_actions_available > 0) {
					let sortable: [string, IPlayer][] = [];
					for (const playerId in selectedRoom.playersAvailable) {
						sortable.push([playerId, selectedRoom.playersAvailable[playerId]]);
					}
					sortable.sort((a: any, b: any) => b[1].points - a[1].points);
					let idOfPlayerWithMaxPoints = sortable[0][0];
					let maxPlayerDetails = sortable[0][1];

					// now add this player to player one's squad and delete it from the pool
					selectedRoom.playerTwoSquad[idOfPlayerWithMaxPoints] =
						maxPlayerDetails;
					delete selectedRoom.playersAvailable[idOfPlayerWithMaxPoints];
					rooms[roomId] = selectedRoom;
					await database.set("rooms", JSON.stringify(rooms));
				} else {
					return;
				}
			}
			params.roomsIo
				.to([roomId])
				.emit("current-game-state", { data: selectedRoom });
			return;
		} catch (err) {
			console.log(err);
		}
	},
	change_game_state_to_completed: async function (
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			console.log("\x1b[32m%s\x1b[0m", "game instance has completed");
			let rooms: any = await database.get("rooms");
			if (!rooms) {
				return;
			}
			rooms = JSON.parse(rooms);

			let selectedRoom: IRoom = rooms[roomId];
			selectedRoom.is_completed = true;

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
	check_if_actions_left: async function (
		playerId: string,
		roomId: string,
		params: IStartGameParams
	): Promise<any> {
		try {
			console.log("\x1b[32m%s\x1b[0m", "checking if actions left");
			let rooms: any = await database.get("rooms");
			if (!rooms) {
				return;
			}
			rooms = JSON.parse(rooms);

			let selectedRoom: IRoom = rooms[roomId];
			if (selectedRoom.playerOneId === playerId) {
				if (selectedRoom.player_one_actions_available > 0) {
					return true;
				} else {
					return false;
				}
			} else if (selectedRoom.playerTwoId === playerId) {
				if (selectedRoom.player_two_actions_available > 0) {
					return true;
				} else {
					return false;
				}
			}

			return true;
		} catch (err) {
			console.log(err);
			return true;
		}
	},
};
export default gameController;
