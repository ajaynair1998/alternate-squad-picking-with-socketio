import { Manager } from "socket.io-client";
const password = "password";
export const createSocket = (room?: string, playerName?: string) => {
	try {
		const manager = new Manager("ws://http:localhost:5050", {
			transports: ["websocket", "polling"],
			reconnectionDelayMax: 10000,
			query: {
				room: room ? room : "default",
				playerName: playerName ? playerName : "default",
			},
		});
		const socket = manager.socket("/head-to-head", {
			auth: {
				token: password,
			},
		});

		return socket;
	} catch (err) {
		console.log(err);
	}
};
