import React from "react";
import { Grid } from "@mui/material";
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

const defaultItems: ISingleItemProps[] = [
	{ name: "virat", id: "qwed23" },
	{ name: "sehwag", id: "asf3ase" },
	{ name: "dhoni", id: "qed23" },
	{ name: "goku", id: "asffgase" },
	{ name: "vegeta", id: "qwedjh23" },
	{ name: "broly", id: "asfsa3ase" },
	{ name: "chichi", id: "qedxc23" },
	{ name: "gohan", id: "asffzxgase" },
];

const Room = ({ playerId }: { playerId?: string }) => {
	let { data } = useSelector((state: IStore) => state.socketStore);
	return (
		<Grid container direction={"row"} width={"70%"} mx={"auto"} mt={"200px"}>
			<SingleColumnSelection color={"success"} selectedSide="playerOne" />
			<SingleColumnSelection selectedSide="selection-column" />
			<SingleColumnSelection color={"error"} selectedSide="playerTwo" />
		</Grid>
	);
};

export default Room;
