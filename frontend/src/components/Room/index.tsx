import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import SingleColumnSelection from "../Selection";
import { useSelector } from "react-redux";
import { IStore } from "../../helpers/interfaces";

export interface ISingleItemProps {
	name: string;
	id: string;
	selectedSide?: string;
	disabled?: boolean;
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

const Room = ({ playerId }: { playerId?: string }) => {
	let { data } = useSelector((state: IStore) => state.socketStore);
	return (
		<React.Fragment>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
				}}
			>
				{" "}
				<Typography variant="h3">{data.playerId}</Typography>{" "}
			</Box>
			<Grid container direction={"row"} width={"70%"} mx={"auto"} mt={"200px"}>
				<SingleColumnSelection color={"success"} selectedSide={"playerOne"} />
				<SingleColumnSelection selectedSide="selection-column" />
				<SingleColumnSelection color={"error"} selectedSide={"playerTwo"} />
			</Grid>
		</React.Fragment>
	);
};

export default Room;
