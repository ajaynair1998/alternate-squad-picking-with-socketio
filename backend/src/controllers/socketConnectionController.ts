import { Request, Response } from "express";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import uniqid from "uniqid";
import { database } from "../db";
import { IPlayers, IRoom } from "../helpers/interfaces";

const socketConnectionController = {
	main: (
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	) => {
		try {
			socket.emit("message", "message from server");

			socket.on("join-game", ({ playerName, roomId, playerId }) => {
				socketConnectionController.join_game(roomId, socket, playerId);
				// console.log("joined-player", playerName);
				// socket.emit("response", {
				// 	data: "some data in response",
				// });
			});

			socket.on(
				"action-on-player",
				({ roomId, playerId, selectedSquadPlayerId }) => {
					console.log("action-on-player");
					socketConnectionController.action_on_player(
						socket,
						roomId,
						playerId,
						selectedSquadPlayerId
					);
				}
			);

			// When a player disconnects
			socket.on("disconnect", () => {
				// socketConnectionController.create_room(socket);
				console.log("disconnected");
			});
		} catch (err) {
			console.log(err);
		}
	},

	join_room: async (
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	) => {
		try {
			let newRoom = uniqid();
			socket.join(newRoom);
		} catch (err) {
			console.log(err);
		}
	},

	create_room: async (
		socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	) => {
		try {
			let playersAvailable: IPlayers[] = [
				{ id: "sdf3", name: "virat" },
				{ id: "sdf4", name: "goku" },
				{ id: "sdf5", name: "vegeta" },
			];
			const room: IRoom = {
				id: "room-one",
				playerOneSquad: [],
				playerTwoSquad: [],
				playerOneId: "player-one",
				playerTwoId: "player-two",
				playersAvailable: playersAvailable,
				playerOneTurn: false,
				playerTwoTurn: false,
				timer: 5,
			};

			const rooms = {
				"room-one": room,
			};
			await database.set("rooms", JSON.stringify(rooms));
			console.log("room created");
		} catch (err) {
			console.log(err);
		}
	},
	join_game: async (
		roomId: string,
		socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
		playerId?: string
	) => {
		console.log("data-recieved in join-game", roomId, playerId);
		console.log(
			"🚀 ~ file: socketConnectionController.ts ~ line 93 ~ roomId",
			roomId
		);
		if (socket) {
			let roomData: any = await database.get("rooms");
			if (roomData) {
				roomData = JSON.parse(roomData);
				let playerRoom = roomData[roomId];
				if (playerRoom) {
					console.log("room found");
				}
				socket.emit("response-for-join-game", { data: playerRoom });
			}
		}
		try {
		} catch (err) {
			console.log(err);
		}
	},

	action_on_player: async (
		socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
		roomId?: string,
		playerId?: string,
		selectedSquadPlayerId?: string
	) => {
		console.log(
			"data-recieved in action_on_player",
			roomId,
			playerId,
			selectedSquadPlayerId
		);
		try {
		} catch (err) {
			console.log(err);
		}
	},
};
export default socketConnectionController;
