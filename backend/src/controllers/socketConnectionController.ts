import { Request, Response } from "express";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import uniqid from "uniqid";
import { database } from "../db";
import { IPlayer, IRoom } from "../helpers/interfaces";

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
						roomId,
						playerId,
						selectedSquadPlayerId,
						socket
					);
				}
			);

			// When a player disconnects
			socket.on("disconnect", () => {
				socketConnectionController.create_room(socket);
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
			let playersAvailable = {
				sdf3: { id: "sdf3", name: "virat" },
				sdf4: { id: "sdf4", name: "goku" },
				sdf5: { id: "sdf5", name: "vegeta" },
			};
			const room: IRoom = {
				id: "room-one",
				playerOneSquad: {},
				playerTwoSquad: {},
				playerOneId: "player-one",
				playerTwoId: "player-two",
				playersAvailable: playersAvailable,
				playerOneTurn: false,
				playerTwoTurn: false,
				timer: 5,
				is_completed: false,
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
		roomId: string,
		playerId: string,
		selectedSquadPlayerId: string,
		socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	) => {
		console.log(
			"data-recieved in action_on_player",
			roomId,
			playerId,
			selectedSquadPlayerId
		);

		let rooms: any = await database.get("rooms");
		if (!rooms) {
			return;
		}
		rooms = JSON.parse(rooms);
		if (roomId && rooms) {
			let selectedRoom: IRoom = rooms[roomId];
			console.log(
				"🚀 ~ file: socketConnectionController.ts ~ line 134 ~ selectedRoom",
				selectedRoom
			);

			let allPlayersThatAreAvailable = selectedRoom.playersAvailable;
			console.log(
				"🚀 ~ file: socketConnectionController.ts ~ line 140 ~ allPlayersThatAreAvailable",
				allPlayersThatAreAvailable
			);
			let selectedPlayer = allPlayersThatAreAvailable[selectedSquadPlayerId];

			delete allPlayersThatAreAvailable[selectedSquadPlayerId];
			console.log(allPlayersThatAreAvailable);
			if (playerId === "player-one") {
				selectedRoom.playersAvailable = allPlayersThatAreAvailable;
				selectedRoom.playerOneSquad[selectedSquadPlayerId] = selectedPlayer;
				console.log("player-one-action", selectedRoom.playerOneSquad);
			}
			if (playerId === "player-two") {
				selectedRoom.playersAvailable = allPlayersThatAreAvailable;
				selectedRoom.playerTwoSquad[selectedSquadPlayerId] = selectedPlayer;
			}
			rooms[roomId] = selectedRoom;
			console.log(
				"🚀 ~ file: socketConnectionController.ts ~ line 159 ~ rooms",
				rooms
			);

			await database.set("rooms", JSON.stringify(rooms));

			socket?.emit("response-for-join-game", { data: selectedRoom });
		}
		try {
		} catch (err) {
			console.log(err);
		}
	},
};
export default socketConnectionController;
