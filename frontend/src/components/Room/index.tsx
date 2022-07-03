import React from "react";
import { Grid } from "@mui/material";
import SingleColumnSelection from "../Selection";

export interface ISingleItemProps {
	name: string;
	id: string;
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

const Room = () => {
	return (
		<Grid container direction={"row"} width={"70%"} mx={"auto"} mt={"200px"}>
			<SingleColumnSelection
				items={defaultItems}
				color={"success"}
				disabled={true}
			/>
			<SingleColumnSelection items={defaultItems} />
			<SingleColumnSelection items={defaultItems} color={"error"} />
		</Grid>
	);
};

export default Room;
