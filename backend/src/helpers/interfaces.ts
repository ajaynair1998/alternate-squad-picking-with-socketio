export interface IPlayer {
	name: string;
	id: string;
}

export interface IRoom {
	id: string;
	playerOneId: string;
	playerTwoId: string;
	playerOneSquad: { [key: string]: IPlayer };
	playerTwoSquad: { [key: string]: IPlayer };
	playersAvailable: { [key: string]: IPlayer };
	playerOneTurn: boolean;
	playerTwoTurn: boolean;
	timer: number;
	is_completed: boolean;
}

export interface IRooms {
	[key: string]: IRoom;
}
