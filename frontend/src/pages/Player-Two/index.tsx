import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import { createSocket } from "../../configs";
import { Box, Grid } from "@mui/material";
import Room from "../../components/Room";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../../helpers/interfaces";
import {
	setSelectedPlayerId,
	setSelectedroomId,
	setSelectedSocket,
} from "../../redux/reducers/SocketDataReducer";

const PlayerTwo = () => {
	let dispatch = useDispatch();
	const [socket, setSocket] = useState<
		Socket<DefaultEventsMap, DefaultEventsMap> | undefined | null
	>(null);
	const [joined, setJoined] = useState(false);
	const { data } = useSelector((state: IStore) => state.socketStore);

	useEffect(() => {
		const newSocket = createSocket("room-one");
		newSocket?.emit("join-game", {
			playerName: "player-two",
		});
		if (newSocket) {
			dispatch(setSelectedSocket(newSocket));
			dispatch(setSelectedPlayerId("player-two"));
			dispatch(setSelectedroomId("room-one"));

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
				console.log("player-two-connected", socket.connected);
			});
		}
	}, [socket]);

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<Box>
			<Room />
		</Box>
	);
};

export default PlayerTwo;
