import { Server, Socket } from "socket.io";
import { GAME_TYPE } from "../Enum/GameType.js";
import { SocketHandler } from './SocketHandler.js';
import { FriendCardPlayer } from "../GameFlow/Player/FriendCardPlayer.js";
import { FriendCardGameRoom } from "../GameFlow/Game/FriendCardGameRoom.js";
import { SOCKET_GAME_EVENTS } from "../Enum/SocketEvents.js";
import { FriendCardGameStateForPlayerDTO } from "../Model/DTO/FriendCardGameStateForPlayerDTO.js";
import { CardId, ColorType } from "../Enum/CardConstant.js";
import { CardPlayedDTO } from "../Model/DTO/CardPlayedDTO.js";
import { BaseResponseDTO } from "../Model/DTO/Response/BaseResponseDTO.js";
import { CardPlayedResponseDTO } from "../Model/DTO/Response/CardPlayedResponseDTO.js";
import { AuctionPointDTO, AuctionPointResponseDTO } from "../Model/DTO/AuctionPointDTO.js";
import { TrumpAndFriendDTO } from "../Model/DTO/TrumpAndFriendDTO.js";
import { HandlerValidation } from "./HandlerValidation.js";
import { PlayerDTO } from "../Model/DTO/PlayerDTO.js";
import { GameRoom } from "../GameFlow/Game/GameRoom.js";
import { Player } from "../GameFlow/Player/Player.js";
import {WinnerTrickResponse} from "../Model/DTO/Response/WinnerTrickResponse.js";
import {WinnerRoundResponse} from "../Model/DTO/Response/WinnerRoundResponse.js";
import {EMOJI} from "../Enum/Emoji.js";
import {GAME_STATE} from "../Enum/GameState.js";
import {GameFinishedDTO} from "../Model/DTO/GameFinishedDTO.js";

export class FriendCardGameHandler extends SocketHandler
{
    constructor(io: Server) {
		super(io, GAME_TYPE.FRIENDCARDGAME);
	}
    protected OnConnection(socket: Socket, gameRoom: GameRoom, player: Player): void
    {
        if (!(gameRoom instanceof FriendCardGameRoom)) throw new Error('GameType mismatch');
		if (!(player instanceof FriendCardPlayer)) throw new Error('PlayerType mismatch');

        socket.on(SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY, () => {
            player.ToggleIsReady();
            super.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY, gameRoom.id, PlayerDTO.CreateFromPlayer(player));
        });
        socket.on(SOCKET_GAME_EVENTS.START_GAME, (callback: (response: BaseResponseDTO) => void) => {
            try
            {
                HandlerValidation.IsGameRoomNotStartedState(gameRoom);
                HandlerValidation.IsOwnerRoom(gameRoom, player);
                HandlerValidation.PlayerGreaterThanFour(gameRoom);
                HandlerValidation.AreAllPlayersReady(gameRoom);
                gameRoom.RestartFriendCardGameRoom()
                gameRoom.StartGameProcess();
                super.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.START_GAME, gameRoom.id);
                callback({ success: true } as BaseResponseDTO);
            }
            catch(ex : any)
            {
                callback({ success: false, error: ex?.message } as BaseResponseDTO);
            }
		});
        socket.on(SOCKET_GAME_EVENTS.AUCTION, (auctionPass: boolean, auctionPoint: number, callback: (response: AuctionPointResponseDTO | BaseResponseDTO) => void) => {
            try
            {
                HandlerValidation.GameAndRoundStarted(gameRoom);
                HandlerValidation.IsGamePlayNotStarted(gameRoom);
                HandlerValidation.IsPlayerTurn(gameRoom, player);
                HandlerValidation.AcceptableAuctionPoint(auctionPass, auctionPoint);
                HandlerValidation.FirstPlayerCannotNotPass(gameRoom, auctionPass);
                HandlerValidation.AuctionPointGreaterThan(auctionPass, auctionPoint, gameRoom.GetCurrentRoundGame().GetAuctionPoint());
                gameRoom.GetCurrentRoundGame().AuctionProcess(auctionPass, auctionPoint);
                const [nextPlayerId, highestAuctionPlayerId, currentAuctionPoint, gameplayState] = gameRoom.GetCurrentRoundGame().GetInfoForAuctionPointResponse();
                const auctionPointDTO: AuctionPointDTO = {
                    playerId: player.id,
                    isPass: auctionPass,
                    auctionPoint: !auctionPass ? auctionPoint : undefined,
                    nextPlayerId: nextPlayerId,
                    highestAuctionPlayerId: highestAuctionPlayerId ?? "",
                    highestAuctionPoint: currentAuctionPoint,
                };
                super.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.AUCTION, gameRoom.id, auctionPointDTO);
                callback({
                    success: true,
                })
            }
            catch(ex: any)
            {
                callback({ success: false, error: ex.message } as BaseResponseDTO);
            }
        });
        socket.on(SOCKET_GAME_EVENTS.SELECT_MAIN_CARD, (trumpColor: ColorType, friendCard: CardId, callback: (response: TrumpAndFriendDTO | BaseResponseDTO) => void) => {
            try
            {
                HandlerValidation.GameAndRoundAndGameplayStarted(gameRoom);
                HandlerValidation.IsWinnerAuction(gameRoom, player);
                HandlerValidation.IsFriendCardAndTrumpCardValid(gameRoom, friendCard, trumpColor);
                HandlerValidation.NotHasCardInHand(player, friendCard);
                HandlerValidation.NotAlreadySetTrumpAndFriend(gameRoom);
                gameRoom.GetCurrentRoundGame().SetTrumpAndFriendProcess(trumpColor, friendCard, player);
                const trumpAndFriendDTO :TrumpAndFriendDTO = {
                    playerId: player.id,
                    trumpColor: trumpColor,
                    friendCard: friendCard
                };
                super.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.SELECT_MAIN_CARD, gameRoom.id, trumpAndFriendDTO);
                callback({
                    success: true
                } as BaseResponseDTO);
            }
            catch(error: any)
            {
                callback({ success: false, error: error?.message } as BaseResponseDTO);
            }
        });
        socket.on(SOCKET_GAME_EVENTS.CARD_PLAYED,(cardId: CardId, callback: (response: CardPlayedResponseDTO | BaseResponseDTO) => void) => {
            try
            {
                HandlerValidation.AlreadySetTrumpAndFriend(gameRoom);
                HandlerValidation.IsGameRoomStartedState(gameRoom);
                HandlerValidation.IsPlayerTurn(gameRoom, player);
                HandlerValidation.HasCardOnHand(gameRoom, player, cardId);
                const playedCard: CardId = gameRoom.GetCurrentRoundGame().PlayCardProcess(cardId, player.id);

                if(gameRoom.IsCurrentRoundGameFinished() && gameRoom.CheckGameFinished()){
                    console.log("in game finished")
                    gameRoom.FinishGameProcess()
                    const winner: FriendCardPlayer | undefined = gameRoom.GetWinner()
                    if(winner){
                        const winnerResponse: GameFinishedDTO = {
                            winnerId: winner.id,
                            winnerName: winner.username,
                            winnerPoint: gameRoom.GetWinnerPoint(),
                            roundsFinishedDetail: gameRoom.GetAllRoundResult()
                        }
                        super.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.GAME_FINISHED, gameRoom.id, winnerResponse);
                        // gameRoom.RestartFriendCardGameRoom()
                    }
                    else{
                        console.log("Winner not found")
                    }
                }
                else if (gameRoom.IsCurrentRoundGameFinished())
                {
                    console.log("in round finished")
                    const roundFinishedResponse: WinnerRoundResponse[] = gameRoom.GetAllRoundResult()
                    gameRoom.NextRoundProcess();
                    super.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.ROUND_FINISHED, gameRoom.id, roundFinishedResponse);
                }
                else if (gameRoom.GetCurrentRoundGame().IsEndOfTrick())
                {
                    console.log("in trick finished")
                    const winnerTrickModel: WinnerTrickResponse | undefined = gameRoom.GetCurrentRoundGame().GetLatestWinnerTrickResponse();
                    super.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.TRICK_FINISHED, gameRoom.id, winnerTrickModel);
                }
                const cardPlayedDTO: CardPlayedDTO = {
                    playerId: player.id,
                    cardId: playedCard
                };
                super.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.CARD_PLAYED, gameRoom.id, cardPlayedDTO);
                callback({
                    success: true
                } as BaseResponseDTO);
            }
            catch (error: any)
            {
                callback({ success: false, error: error?.message } as BaseResponseDTO);
            }
        });
        socket.on(SOCKET_GAME_EVENTS.GET_GAME_STATE, (callback: (friendCardGameStateForPlayer: FriendCardGameStateForPlayerDTO | BaseResponseDTO) => void) => {
            try
            {
                HandlerValidation.GameAndRoundNotNotStarted(gameRoom);
                callback(FriendCardGameStateForPlayerDTO.CreateFromFriendCardGameAndPlayer(gameRoom, player));
            }catch (error: any)
            {
                callback({ success: false, error: error?.message } as BaseResponseDTO);
            }
        });
        socket.on(SOCKET_GAME_EVENTS.GET_SCORE_CARD, (playerId: string, callback: (friendCardGameStateForPlayer: CardId[] | BaseResponseDTO) => void) => {
            try
            {
                HandlerValidation.GameAndRoundStarted(gameRoom);
                const scoreCardIds: CardId[] = gameRoom.GetCurrentRoundGame().GetScoreCard(playerId)
                callback(scoreCardIds);
            }catch (error: any)
            {
                callback({ success: false, error: error?.message } as BaseResponseDTO);
            }
        });
        socket.on(SOCKET_GAME_EVENTS.EMOJI, (emoji: EMOJI, callback: (result: BaseResponseDTO) => void) => {
            try
            {
                const response = {
                    playerId: player.id,
                    emoji: emoji
                }
                super.EmitToRoomAndSender(socket, SOCKET_GAME_EVENTS.EMOJI, gameRoom.id, response);
                callback({ success: true } as BaseResponseDTO);
            }catch (error: any)
            {
                callback({ success: false, error: error?.message } as BaseResponseDTO);
            }
        });
    }
}