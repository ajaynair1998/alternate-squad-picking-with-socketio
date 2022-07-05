import { createSlice } from "@reduxjs/toolkit";

export const SocketDataSlice = createSlice({
	name: "socket",
	initialState: {
		data: {
			socket: null,
			roomId: null,
			playerId: null,
			playerOneSquad: [],
			playerTwoSquad: [],
			allSquadPlayers: [{ name: "goku", id: "123s" }],
			playerOneDisabled: false,
			playerTwoDisabled: false,
		},
	},
	reducers: {
		setSelectedSocket: (state: any, action: any) => {
			state.data.socket = action.payload;
		},
		setSelectedroomId: (state: any, action: any) => {
			state.data.roomId = action.payload;
		},
		setSelectedPlayerId: (state: any, action: any) => {
			state.data.playerId = action.payload;
		},
		setSelectedPlayerOneSquad: (state: any, action: any) => {
			state.data.playerOneSquad = action.payload;
		},
		setSelectedPlayerTwoSquad: (state: any, action: any) => {
			state.data.playerTwoSquad = action.payload;
		},
		setSelectedAllSquadPlayers: (state: any, action: any) => {
			state.data.allSquadPlayers = action.payload;
		},

		setPlayerOneDisabled: (state: any, action: any) => {
			state.data.playerOneDisabled = action.payload;
		},
		setPlayerTwoDisabled: (state: any, action: any) => {
			state.data.playerTwoDisabled = action.payload;
		},
	},
});

export const {
	setSelectedSocket,
	setSelectedroomId,
	setSelectedPlayerId,
	setSelectedPlayerOneSquad,
	setSelectedPlayerTwoSquad,
	setSelectedAllSquadPlayers,
	setPlayerOneDisabled,
	setPlayerTwoDisabled,
} = SocketDataSlice.actions;
export default SocketDataSlice.reducer;
