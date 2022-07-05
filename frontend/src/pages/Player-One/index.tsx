import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import { createSocket } from "../../configs";
import { Box, Grid } from "@mui/material";
import Room from "../../components/Room";
import { useSelector } from "react-redux";
import { IStore } from "../../helpers/interfaces";

const PlayerOne = () => {
	const [socket, setSocket] = useState<
		Socket<DefaultEventsMap, DefaultEventsMap> | undefined | null
	>(null);
	const [joined, setJoined] = useState(false);
	const { data } = useSelector((state: IStore) => state.socketStore);
	console.log("🚀 ~ file: index.tsx ~ line 17 ~ PlayerOne ~ data", data);

	useEffect(() => {
		const newSocket = createSocket("room-one");
		newSocket?.emit("join-game", {
			playerName: "player-one",
		});
		if (newSocket) {
			setSocket(newSocket);
			setJoined(true);
		}

		return () => {
			socket?.close();
		};
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on("response", (data: any) => {
				console.log("player-one-connected", socket.connected);
			});
		}
	}, [socket]);

	return (
		<Box>
			<Room />
		</Box>
	);
};

export default PlayerOne;
