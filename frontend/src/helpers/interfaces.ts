export interface IStore {
	socketStore: {
		data: {
			socket: any;
			roomId: any;
			playerId: any;
			playerOneSquad: any[];
			playerTwoSquad: any[];
			allSquadPlayers: any[];
			playerOneDisabled: boolean;
			playerTwoDisabled: boolean;
		};
	};
}
