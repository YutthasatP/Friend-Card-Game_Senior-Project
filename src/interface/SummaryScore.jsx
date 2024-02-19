import "./SummaryScore.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SetPage } from "../store/PageStateSlice.jsx";
import PAGE_STATE from "../enum/PageStateEnum.jsx";
import { DisconnectFromSocket } from "../store/SocketSlice.jsx";
import { ResetPlayersInGame } from "../store/GameSlice.jsx";
import { ResetAllListenerState } from "../store/SocketGameListenersSlice.jsx";
import { ResetAllEmitterState } from "../store/SocketGameEmittersSlice.jsx";
export default function SummaryScore({
  isShowButton,
  setIsShowGameFinishedPopup,
}) {
  const roundFinishedResult =
    useSelector(
      (state) => state.socketGameListenersStore.roundFinishedResult
    ) ?? [];
  const gameFinishResult = useSelector(
    (state) => state.socketGameListenersStore.gameFinishedResult
  );

  const [playerNameArray, setPlayerNameArray] = useState([]);
  const [playerIdsArray, setPlayerIdsArray] = useState([]);
  const [firstRoundPoint, setFirstRoundPoint] = useState([]);
  const [secondRoundPoint, setSecondRoundPoint] = useState([]);
  const [thirdRoundPoint, setThirdRoundPoint] = useState([]);
  const [fourthRoundPoint, setFourthRoundPoint] = useState([]);
  const [totalGamePoint, setTotalGamePoint] = useState([]);
  const [maxPoint, setMaxPoint] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (roundFinishedResult && !isShowButton) {
      const firstRound = roundFinishedResult.find((a) => a.roundNumber === 0);
      const secondRound = roundFinishedResult.find((a) => a.roundNumber === 1);
      const thirdRound = roundFinishedResult.find((a) => a.roundNumber === 2);
      const fourthRound = roundFinishedResult.find((a) => a.roundNumber === 3);
      InitState(firstRound, secondRound, thirdRound, fourthRound);
    }
  }, [roundFinishedResult]);

  useEffect(() => {
    if (gameFinishResult && isShowButton) {
      const firstRound = gameFinishResult.roundsFinishedDetail.find(
        (a) => a.roundNumber === 0
      );
      const secondRound = gameFinishResult.roundsFinishedDetail.find(
        (a) => a.roundNumber === 1
      );
      const thirdRound = gameFinishResult.roundsFinishedDetail.find(
        (a) => a.roundNumber === 2
      );
      const fourthRound = gameFinishResult.roundsFinishedDetail.find(
        (a) => a.roundNumber === 3
      );
      InitState(firstRound, secondRound, thirdRound, fourthRound);
    }
  }, [gameFinishResult]);

  useEffect(() => {
    setTotalGamePoint([
      CalculateTotalScore(0),
      CalculateTotalScore(1),
      CalculateTotalScore(2),
      CalculateTotalScore(3),
    ]);
  }, [firstRoundPoint, secondRoundPoint, thirdRoundPoint, fourthRoundPoint]);

  useEffect(() => {
    setMaxPoint(Math.max(...totalGamePoint));
  }, [totalGamePoint]);
  function InitState(firstRound, secondRound, thirdRound, fourthRound) {
    const playerNames =
      firstRound?.playersPoint?.map((player) => player.playerName) ?? [];
    const playerIds =
      firstRound?.playersPoint?.map((player) => player.playerId) ?? [];

    if (
      playerNameArray?.at(0) !== playerNames?.at(0) ||
      playerNameArray?.at(1) !== playerNames?.at(1) ||
      playerNameArray?.at(2) !== playerNames?.at(2) ||
      playerNameArray?.at(3) !== playerNames?.at(3)
    ) {
      setPlayerNameArray(playerNames);
    }
    if (
      playerIdsArray?.at(0) !== playerIds?.at(0) ||
      playerIdsArray?.at(1) !== playerIds?.at(1) ||
      playerIdsArray?.at(2) !== playerIds?.at(2) ||
      playerIdsArray?.at(3) !== playerIds?.at(3)
    ) {
      setPlayerIdsArray(playerIds);
    }
    const round1 = CalculatePlayersPointByRound(firstRound, playerNames);
    const round2 = CalculatePlayersPointByRound(secondRound, playerNames);
    const round3 = CalculatePlayersPointByRound(thirdRound, playerNames);
    const round4 = CalculatePlayersPointByRound(fourthRound, playerNames);
    if (
      round1?.at(0) !== firstRoundPoint?.at(0) ||
      round1?.at(1) !== firstRoundPoint?.at(1) ||
      round1?.at(2) !== firstRoundPoint?.at(2) ||
      round1?.at(3) !== firstRoundPoint?.at(3)
    ) {
      setFirstRoundPoint(round1);
    }
    if (
      round2?.at(0) !== secondRoundPoint?.at(0) ||
      round2?.at(1) !== secondRoundPoint?.at(1) ||
      round2?.at(2) !== secondRoundPoint?.at(2) ||
      round2?.at(3) !== secondRoundPoint?.at(3)
    ) {
      setSecondRoundPoint(round2);
    }
    if (
      round3?.at(0) !== thirdRoundPoint?.at(0) ||
      round3?.at(1) !== thirdRoundPoint?.at(1) ||
      round3?.at(2) !== thirdRoundPoint?.at(2) ||
      round3?.at(3) !== thirdRoundPoint?.at(3)
    ) {
      setThirdRoundPoint(round3);
    }
    if (
      round4?.at(0) !== fourthRoundPoint?.at(0) ||
      round4?.at(1) !== fourthRoundPoint?.at(1) ||
      round4?.at(2) !== fourthRoundPoint?.at(2) ||
      round4?.at(3) !== fourthRoundPoint?.at(3)
    ) {
      setFourthRoundPoint(round4);
    }
  }
  function CalculatePlayersPointByRound(round, playerNames) {
    const firstPlayerPoint = CalculatePoint(round, playerNames.at(0));
    const secondPlayerPoint = CalculatePoint(round, playerNames.at(1));
    const thirdPlayerPoint = CalculatePoint(round, playerNames.at(2));
    const fourthPlayerPoint = CalculatePoint(round, playerNames.at(3));
    return [
      firstPlayerPoint,
      secondPlayerPoint,
      thirdPlayerPoint,
      fourthPlayerPoint,
    ];
  }
  function GenerateWinnerIcon(roundNumber, playerId) {
    let result = "";
    if (roundFinishedResult) {
      const roundObj = roundFinishedResult.find(
        (a) => a.roundNumber === roundNumber
      );
      if (roundObj?.winnerPlayerIds.some((id) => id === playerId)) {
        result = "⭐";
      }
    }
    if (gameFinishResult && result !== "⭐") {
      const roundObj = gameFinishResult.roundsFinishedDetail.find(
        (a) => a.roundNumber === roundNumber
      );
      if (roundObj?.winnerPlayerIds.some((id) => id === playerId)) {
        result = "⭐";
      }
    }
    return result;
  }
  function CalculatePoint(round, playerName) {
    let result = undefined;
    if (round) {
      for (const player of round.playersPoint) {
        if (player.playerName.toString() === playerName.toString()) {
          result = player.gamePointReceive;
          break;
        }
      }
    }
    return result;
  }
  function CalculateTotalScore(playerIndex) {
    return (
      (firstRoundPoint.at(playerIndex) ?? 0) +
      (secondRoundPoint.at(playerIndex) ?? 0) +
      (thirdRoundPoint.at(playerIndex) ?? 0) +
      (fourthRoundPoint.at(playerIndex) ?? 0)
    );
  }
  function HighestTotalScoreRedBoldText(playerIndex) {
    return totalGamePoint.at(playerIndex) === maxPoint
      ? "text-red-600 font-bold"
      : "";
  }
  function HandleBackToMenu() {
    dispatch(DisconnectFromSocket());
    dispatch(ResetPlayersInGame());
    dispatch(ResetAllListenerState());
    dispatch(SetPage({ pageState: PAGE_STATE.MENU }));
  }
  function HandleStayThisLobby() {
    dispatch(ResetAllEmitterState());
    dispatch(ResetAllListenerState());
    setIsShowGameFinishedPopup(false);
  }
  return (
    <>
      <div className="popup-summary">
        <table className="table-summary">
          <thead className="">
            <tr>
              <th colSpan={5}>Game Summary</th>
            </tr>
            <tr>
              <th scope="col" className="table-topleft"></th>
              <th scope="col" className="table-playername">
                {playerNameArray[0]}
              </th>
              <th scope="col" className="table-playername">
                {playerNameArray[1]}
              </th>
              <th scope="col" className="table-playername">
                {playerNameArray[2]}
              </th>
              <th scope="col" className="table-playername">
                {playerNameArray[3]}
              </th>
            </tr>
          </thead>
          <tbody className="table-summary-row">
            <tr>
              <th scope="row">Round 1</th>
              <td>
                {firstRoundPoint.at(0) ?? ""}{" "}
                {GenerateWinnerIcon(0, playerIdsArray.at(0))}                
              </td>
              <td>
                {firstRoundPoint.at(1) ?? ""}{" "}
                {GenerateWinnerIcon(0, playerIdsArray.at(1))}
                
              </td>
              <td>
                {firstRoundPoint.at(2) ?? ""}{" "}
                {GenerateWinnerIcon(0, playerIdsArray.at(2))}
                
              </td>
              <td>
                {firstRoundPoint.at(3) ?? ""}{" "}
                {GenerateWinnerIcon(0, playerIdsArray.at(3))}
                
              </td>
            </tr>
            <tr>
              <th scope="row">Round 2</th>
              <td>
                {secondRoundPoint.at(0) ?? ""}{" "}
                {GenerateWinnerIcon(1, playerIdsArray.at(0))}
              </td>
              <td>
                {secondRoundPoint.at(1) ?? ""}{" "}
                {GenerateWinnerIcon(1, playerIdsArray.at(1))}
              </td>
              <td>
                {secondRoundPoint.at(2) ?? ""}{" "}
                {GenerateWinnerIcon(1, playerIdsArray.at(2))}
              </td>
              <td>
                {secondRoundPoint.at(3) ?? ""}{" "}
                {GenerateWinnerIcon(1, playerIdsArray.at(3))}
              </td>
            </tr>
            <tr>
              <th scope="row">Round 3</th>
              <td>
                {thirdRoundPoint.at(0) ?? ""}{" "}
                {GenerateWinnerIcon(2, playerIdsArray.at(0))}
              </td>
              <td>
                {thirdRoundPoint.at(1) ?? ""}{" "}
                {GenerateWinnerIcon(2, playerIdsArray.at(1))}
              </td>
              <td>
                {thirdRoundPoint.at(2) ?? ""}{" "}
                {GenerateWinnerIcon(2, playerIdsArray.at(2))}
              </td>
              <td>
                {thirdRoundPoint.at(3) ?? ""}{" "}
                {GenerateWinnerIcon(2, playerIdsArray.at(3))}
              </td>
            </tr>
            <tr>
              <th scope="row">Round 4</th>
              <td>
                {fourthRoundPoint.at(0) ?? ""}{" "}
                {GenerateWinnerIcon(3, playerIdsArray.at(0))}
              </td>
              <td>
                {fourthRoundPoint.at(1) ?? ""}{" "}
                {GenerateWinnerIcon(3, playerIdsArray.at(1))}
              </td>
              <td>
                {fourthRoundPoint.at(2) ?? ""}{" "}
                {GenerateWinnerIcon(3, playerIdsArray.at(2))}
              </td>
              <td>
                {fourthRoundPoint.at(3) ?? ""}{" "}
                {GenerateWinnerIcon(3, playerIdsArray.at(3))}
              </td>
            </tr>
            <tr>
              <th scope="row">Total Score</th>
              <td className={`${HighestTotalScoreRedBoldText(0)}`}>
                {totalGamePoint.at(0)}{" "}
                {totalGamePoint.at(0) === maxPoint ? "👑" : ""}
              </td>
              <td className={`${HighestTotalScoreRedBoldText(1)}`}>
                {totalGamePoint.at(1)}{" "}
                {totalGamePoint.at(1) === maxPoint ? "👑" : ""}
              </td>
              <td className={` ${HighestTotalScoreRedBoldText(2)}`}>
                {totalGamePoint.at(2)}{" "}
                {totalGamePoint.at(2) === maxPoint ? "👑" : ""}
              </td>
              <td className={` ${HighestTotalScoreRedBoldText(3)}`}>
                {totalGamePoint.at(3)}{" "}
                {totalGamePoint.at(3) === maxPoint ? "👑" : ""}
              </td>
            </tr>
          </tbody>
        </table>
        {isShowButton && (
          <div className="summary-button-container">
            <button
              className="summary-button-back"
              onClick={() => HandleBackToMenu()}
            >
              Back to menu
            </button>
            <button
              className="summary-button-close"
              onClick={() => HandleStayThisLobby()}
            >
              Stay this lobby
            </button>
          </div>
        )}
      </div>
    </>
  );
}
