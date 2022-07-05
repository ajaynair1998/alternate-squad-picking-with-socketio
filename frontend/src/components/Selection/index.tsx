import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { ISingleItemProps } from "../Room";
import { useSelector } from "react-redux";
import { IStore } from "../../helpers/interfaces";
import { setPlayerOneDisabled } from "../../redux/reducers/SocketDataReducer";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));
interface IProps {
	selectedSide?: string;
	color?:
		| "inherit"
		| "success"
		| "primary"
		| "secondary"
		| "error"
		| "info"
		| "warning"
		| undefined;
}

const SingleColumnSelection = ({ color, selectedSide }: IProps) => {
	let { data } = useSelector((store: IStore) => store.socketStore);
	let [players, setPlayers] = useState<{ name: string; id: string }[]>([]);
	let [disabled, setDisabled] = useState<boolean>(false);

	useEffect(() => {
		console.log(data);
		if (selectedSide === "playerOne") {
			setPlayers(data.playerOneSquad);
			setDisabled(data.playerOneDisabled);
		}

		if (selectedSide === "selection-column") {
			setPlayers(data.allSquadPlayers);
			setDisabled(false);
		}
	}, [data]);

	return (
		<Grid item xs={3} mx={"auto"}>
			<Box sx={{ width: "100%" }}>
				<Stack spacing={2}>
					{players.map((item) => {
						return (
							<SingleItem
								key={item.id}
								id={item.id}
								name={item.name}
								color={color}
								disabled={disabled}
								selectedSide={selectedSide}
							/>
						);
					})}
				</Stack>
			</Box>
		</Grid>
	);
};

const SingleItem = ({
	name,
	id,
	color,
	disabled,
	selectedSide,
}: ISingleItemProps) => {
	let { data } = useSelector((store: IStore) => store.socketStore);
	let socket = data.socket;

	const handleClick = (selectedSquadPlayerId: string): any => {
		try {
			if (socket && selectedSide === "selection-column") {
				socket.emit("action-on-player", {
					playerId: data.playerId,
					roomId: data.roomId,
					selectedSquadPlayerId: selectedSquadPlayerId,
				});
			}
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Button
			key={id}
			sx={{ my: 0.5 }}
			variant="contained"
			size="small"
			color={`${color ? color : "primary"}`}
			onClick={() => handleClick(id)}
			disabled={disabled}
			aria-label="move all right"
		>
			{name}
		</Button>
	);
};

export default SingleColumnSelection;
