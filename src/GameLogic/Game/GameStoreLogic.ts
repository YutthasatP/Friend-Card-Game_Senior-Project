import { GameLogic } from './GameLogic.js';
import { GAME_STATE } from '../../Enum/GameState.js';
export class GamesStoreLogic
{
	private static instance: GamesStoreLogic;
	private activeGames = new Map<string, GameLogic>();
    private constructor() {}

	public static get getInstance(): GamesStoreLogic
	{
		return this.instance || (this.instance = new this());
	}

	public AddGame(game: GameLogic): void
	{
		this.activeGames.set(game.id, game);
	}

	public DeleteGame(id: string): void
	{
		this.activeGames.delete(id);
	}

	public GetGame(gameId: string): GameLogic | undefined
	{
		return this.activeGames.get(gameId);
	}

	public get allGamesAsArray(): GameLogic[]
	{
		return Array.from(this.activeGames.values());
	}

	public get allNotStartedGamesAsArray(): GameLogic[]
	{
		return this.allGamesAsArray.filter((game) => game.gameState === GAME_STATE.NOT_STARTED);
	}
}