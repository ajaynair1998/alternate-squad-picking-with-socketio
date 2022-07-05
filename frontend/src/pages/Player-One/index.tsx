import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import { createSocket } from "../../configs";
import { Box, Grid } from "@mui/material";
import Room from "../../components/Room";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../../helpers/interfaces";
import {
	setSelectedAllSquadPlayers,
	setSelectedPlayerId,
	setSelectedPlayerOneSquad,
	setSelectedroomId,
	setSelectedSocket,
} from "../../redux/reducers/SocketDataReducer";
import { isNullishCoalesce } from "typescript";

const PlayerOne = () => {
	let dispatch = useDispatch();
	const [socket, setSocket] = useState<
		Socket<DefaultEventsMap, DefaultEventsMap> | undefined | null
	>(null);
	const [joined, setJoined] = useState(false);
	const { data } = useSelector((state: IStore) => state.socketStore);

	useEffect(() => {
		const newSocket = createSocket("room-one");
		newSocket?.emit("join-game", {
			playerId: data.playerId,
			roomId: data.roomId,
		});
		if (newSocket) {
			dispatch(setSelectedSocket(newSocket));
			dispatch(setSelectedPlayerId("player-one"));
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
			socket.on("response-for-join-game", (data: any) => {
				if (data) {
					console.log("player-one-connected", socket.connected, data.data);

					if (data && data.data && data.data.id) {
						console.log(data.data.playersAvailable);
						dispatch(setSelectedAllSquadPlayers(data.data.playersAvailable));
					}
				}
			});
		}
	}, [socket]);

	useEffect(() => {
		console.log("data changed");
		if (data.socket) {
			console.log(data.roomId);
			data?.socket?.emit("join-game", {
				playerId: data.playerId,
				roomId: data.roomId,
			});
		}
	}, [data]);

	return (
		<Box>
			<Room />
		</Box>
	);
};

export default PlayerOne;
