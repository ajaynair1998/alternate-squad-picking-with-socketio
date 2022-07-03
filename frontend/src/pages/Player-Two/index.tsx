import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import { createSocket } from "../../configs";
import { Box, Grid } from "@mui/material";
import Room from "../../components/Room";

const PlayerTwo = () => {
	const [socket, setSocket] = useState<
		Socket<DefaultEventsMap, DefaultEventsMap> | undefined | null
	>(null);
	const [joined, setJoined] = useState(false);

	useEffect(() => {
		const newSocket = createSocket("room-one", "player-two");
		newSocket?.emit("join-game", {
			playerName: "player-two",
		});
		if (newSocket) {
			setSocket(newSocket);
			setJoined(true);
		}
	}, []);

	return (
		<Box>
			<Room />
		</Box>
	);
};

export default PlayerTwo;
