import { createSlice } from "@reduxjs/toolkit";

export const SocketDataSlice = createSlice({
	name: "socket",
	initialState: {
		data: {
			socket: null,
		},
	},
	reducers: {
		setSelectedSocket: (state: any, action: any) => {
			state.data = action.payload;
		},
	},
});

export const { setSelectedSocket } = SocketDataSlice.actions;
export default SocketDataSlice.reducer;
