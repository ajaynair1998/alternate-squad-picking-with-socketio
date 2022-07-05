export interface IPlayers {
	name: string;
	id: string;
}

export interface IRoom {
	id: string;
	playerOneId: string;
	playerTwoId: string;
	playerOneSquad: IPlayers[];
	playerTwoSquad: IPlayers[];
	playersAvailable: IPlayers[];
	playerOneTurn: boolean;
	playerTwoTurn: boolean;
	timer: number;
}

export interface IRooms {
	[key: string]: IRoom;
}
