import { Manager, io } from "socket.io-client";
const password = "password";
export const createSocket = (room?: string, playerName?: string) => {
	try {
		const socket = io(`http://localhost:5050`);

		return socket;
	} catch (err) {
		console.log(err);
	}
};
