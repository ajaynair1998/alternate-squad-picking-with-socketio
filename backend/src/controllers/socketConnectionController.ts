import { Request, Response } from "express";
import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import uniqid from "uniqid";
import { database } from "../db";
import { IPlayer, IRoom } from "../helpers/interfaces";

const socketConnectionController = {
	main: (
		socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
		roomsIo: Namespace<
			DefaultEventsMap,
			DefaultEventsMap,
			DefaultEventsMap,
			any
		>
	) => {
		try {
			socket.emit("message", "message from server");

			socket.on("join-game", ({ playerName, roomId, playerId }) => {
				socketConnectionController.join_game(roomsIo, roomId, socket, playerId);
			});

			socket.on(
				"action-on-player",
				({ roomId, playerId, selectedSquadPlayerId }) => {
					console.log("action-on-player");
					socket.join(roomId);
					socketConnectionController.action_on_player(
						roomsIo,
						roomId,
						playerId,
						selectedSquadPlayerId,
						socket
					);
				}
			);

			socket.on("disconnect", () => {
				// socketConnectionController.create_room(null, socket);
				console.log("disconnected");
			});
		} catch (err) {
			console.log(err);
		}
	},

	create_room: async (
		roomsIo?: Namespace<
			DefaultEventsMap,
			DefaultEventsMap,
			DefaultEventsMap,
			any
		> | null,
		socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	) => {
		try {
			let playersAvailable = {
				sdf3: { id: "sdf3", name: "virat" },
				sdf4: { id: "sdf4", name: "goku" },
				sdf5: { id: "sdf5", name: "vegeta" },
				sdf6: { id: "sdf6", name: "naruto" },
				sdf7: { id: "sdf7", name: "piccolo" },
				sdf8: { id: "sdf8", name: "conor" },
				sdf9: { id: "sdf9", name: "khabib" },
				sdf10: { id: "sdf10", name: "gsp" },
				sdf11: { id: "sdf11", name: "olievera" },
				sdf12: { id: "sdf12", name: "chandler" },
				sdf13: { id: "sdf13", name: "bisping" },
				sdf14: { id: "sdf14", name: "izzy" },
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
			// console.log("room created");
		} catch (err) {
			console.log(err);
		}
	},
	join_game: async (
		roomsIo: Namespace<
			DefaultEventsMap,
			DefaultEventsMap,
			DefaultEventsMap,
			any
		>,
		roomId: string,
		socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
		playerId?: string
	) => {
		socket?.join(roomId);
		console.log("joined room ", roomId);
		if (socket) {
			let roomData: any = await database.get("rooms");
			if (roomData) {
				roomData = JSON.parse(roomData);
				let playerRoom = roomData[roomId];
				if (playerRoom) {
					console.log("room found");
				}
				roomsIo.to(roomId).emit("current-game-state", { data: playerRoom });
			}
		}
		try {
		} catch (err) {
			console.log(err);
		}
	},

	action_on_player: async (
		roomsIo: Namespace<
			DefaultEventsMap,
			DefaultEventsMap,
			DefaultEventsMap,
			any
		>,
		roomId: string,
		playerId: string,
		selectedSquadPlayerId: string,
		socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	) => {
		try {
			let rooms: any = await database.get("rooms");
			if (!rooms) {
				return;
			}
			rooms = JSON.parse(rooms);
			if (roomId && rooms) {
				socket?.join(roomId);
				console.log("joined room", roomId);
				let roomToBeSelected = rooms[roomId];
				let selectedRoom: IRoom = { ...roomToBeSelected };
				let allPlayersThatAreAvailable = selectedRoom.playersAvailable;
				let selectedPlayer = allPlayersThatAreAvailable[selectedSquadPlayerId];

				if (playerId === "player-one" && selectedRoom.playerOneTurn === true) {
					delete allPlayersThatAreAvailable[selectedSquadPlayerId];
					selectedRoom.playersAvailable = allPlayersThatAreAvailable;
					selectedRoom.playerOneSquad[selectedSquadPlayerId] = selectedPlayer;
				}
				if (playerId === "player-two" && selectedRoom.playerTwoTurn === true) {
					delete allPlayersThatAreAvailable[selectedSquadPlayerId];
					selectedRoom.playersAvailable = allPlayersThatAreAvailable;
					selectedRoom.playerTwoSquad[selectedSquadPlayerId] = selectedPlayer;
				}
				rooms[roomId] = selectedRoom;
				await database.set("rooms", JSON.stringify(rooms));

				roomsIo.to([roomId]).emit("current-game-state", { data: selectedRoom });
				console.log("data sent to ", roomId);
				return;
			}
		} catch (err) {
			console.log(err);
		}
	},
};
export default socketConnectionController;
