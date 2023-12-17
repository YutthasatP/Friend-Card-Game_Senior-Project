import {useEffect, useState, useRef} from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import CardInHand from '../component/CardInHannd';
import PlayerCard2 from '../component/PlayerCard2';
import FriendCard from '../component/FriendCard';
import TrumpCard from '../component/TrumpCard';
import SlideBar from '../component/SlideBar';
// import CardTable from '../component/CardTable';
// import TotalScoreBoard from '../component/TotalScoreBoard';
// import EmojiPanel from '../component/EmojiPanel';
import './IngameInterface.css'
import PropTypes from "prop-types";
import WaitingPlayer from "../component/WaitingPlayer/WaitingPlayer.jsx";

function InGameInterface2({socket, userCookie, setIsIntoGameLobby})
{
    const [msg, setFooEvents] = useState({});
    const [cardInhand, setCardInHand] = useState([])
    const [currentCard,setCurrentCard] = useState(-1)
    const role = msg['role'] || []
    const cardInfield= msg['cardInfield'] || []
    const friendCard= msg['friendCard'] ,trumpCard= msg['trumpCard'], turn=msg['turn'] || []
    const GameScore= msg['matchScore'] || []
    const dictCard = {
        1:'2_of_hearts.svg',2:'3_of_hearts.svg',3:'4_of_hearts.svg',4:'5_of_hearts.svg',5:'6_of_hearts.svg',
        6:'7_of_hearts.svg',7:'8_of_hearts.svg',8:'9_of_hearts.svg',9:'10_of_hearts.svg',10:'jack_of_hearts.svg',
        11:'queen_of_hearts.svg',12:'king_of_hearts.svg',13:'ace_of_hearts.svg',

        14:'2_of_diamonds.svg',15:'3_of_diamonds.svg',16:'4_of_diamonds.svg',17:'5_of_diamonds.svg',18:'6_of_diamonds.svg',
        19:'7_of_diamonds.svg',20:'8_of_diamonds.svg',21:'9_of_diamonds.svg',22:'10_of_diamonds.svg',23:'jack_of_diamonds.svg',
        24:'queen_of_diamonds.svg',25:'king_of_diamonds.svg',26:'ace_of_diamonds.svg',

        27:'2_of_clubs.svg',28:'3_of_clubs.svg',29:'4_of_clubs.svg',30:'5_of_clubs.svg',31:'6_of_clubs.svg',
        32:'7_of_clubs.svg',33:'8_of_clubs.svg',34:'9_of_clubs.svg',35:'10_of_clubs.svg',36:'jack_of_clubs.svg',
        37:'queen_of_clubs.svg',38:'king_of_clubs.svg',39:'ace_of_clubs.svg',

        40:'2_of_spades.svg',41:'3_of_spades.svg',42:'4_of_spades.svg',43:'5_of_spades.svg',44:'6_of_spades.svg',
        45:'7_of_spades.svg',46:'8_of_spades.svg',47:'9_of_spades.svg',48:'10_of_spades.svg',49:'jack_of_spades.svg',
        50:'queen_of_spades.svg',51:'king_of_spades.svg',52:'ace_of_spades.svg'

    }
    const suites = {'Hearts':'ace_of_hearts.svg','Diamonds':'ace_of_diamonds.svg','Clubs':'ace_of_clubs.svg','Spades':'ace_of_spades.svg'}
    const n = cardInhand.length
    // const myArray = new Array(n).fill(0);
    const picStyles = { "width": `${Math.min(100 / (n), 100 / 9)}%` }
    const cardInhand_map = cardInhand.map((e)=> {
        return  {
            src:"..\\public\\SVG-cards-1.3\\" + dictCard[e+1],
            id : e
        }
    })
    console.log(cardInfield)
    const cardinfiled_map = cardInfield.map((e)=>"..\\public\\SVG-cards-1.3\\" + dictCard[e+1])
    const friendCard_map = dictCard[friendCard+1]
    const trumpCard_map = suites[trumpCard]
    // const cardName = 'back.svg'
    // const cardPath = "..\\public\\SVG-cards-1.3\\" + cardName
    const offset = 25

    const [isGameStarted, setIsGameStarted] = useState(false)

    function logReceive(event, result){
        console.log("Event: " + event);
        console.log("Received: ");
        console.log(result);
    }
    const [playersInGame, setPlayersInGame] = useState(null)
    let playersInGameRef = useRef(null);


    useEffect(() => {
        socket.connect();
        console.log("socket connected")
        socket.on("players_in_game", result => {
            playersInGameRef.current = result
            setPlayersInGame(result);
        })
    }, []);

    // useEffect(() => {
    //
    // }, [playersInGame]);

    useEffect(() => {
        // function onConnect() {
        //     setIsConnected(true);
        // }
        // function onDisconnect() {
        //     setIsConnected(false);
        // }
        // function onFooEvent(value) {
        //     setFooEvents(value);
        //
        //     console.log(value)
        //     console.log('msg rec')
        // }
        // function moveEvent(res,id) {
        //     console.log(currentCard)
        //     if (res['isLegal']){
        //         setCardInHand((current) => current.filter((card) => card != res['id']))
        //     }
        // }
        // function initCardEvent(res){
        //     setCardInHand(res['cardInhand'])
        // }


        socket.on("player_connected", player => { AddPlayersInRoomWhenOtherConnected(player); })
        socket.on("player_disconnected", player => { ManagePlayerDisconnected(player); })
        socket.on("player_toggle_ready", player => { PlayerToggleReady(player); })
        socket.on("start_game", () => { if(!isGameStarted){ setIsGameStarted(true) }})
        socket.on("auction", result => { logReceive("auction", result); })
        socket.on("select_main_card", result => { logReceive("select_main_card", result); })
        socket.on("card_played", result => { logReceive("card_played", result); })
        socket.on("trick_finished", result => { logReceive("trick_finished", result); })
        socket.on("round_finished", result => { logReceive("round_finished", result); })

        // socket.on('connect', onConnect);
        // socket.on('disconnect', onDisconnect);
        // socket.on('new-message', onFooEvent);
        // socket.on('init-card', initCardEvent);
        // socket.on('legal-move', moveEvent);

        // return () => {
        //     socket.off('connect', onConnect);
        //     socket.off('disconnect', onDisconnect);
        //     socket.off('new-message', onFooEvent);
        //     socket.off('legal-move', moveEvent);
        //     socket.off('init-card', initCardEvent);
        //
        // };
    },[socket]);
    function PlayerToggleReady(togglePlayer){
        playersInGameRef.current = {
            players: playersInGameRef.current.players.filter(player => {
                if (player.id === togglePlayer.id){
                    player.isReady = togglePlayer.isReady
                }
                return true
            }),
            thisPlayer: playersInGameRef.current.thisPlayer,
        };
        setPlayersInGame(playersInGameRef.current)
    }

    function AddPlayersInRoomWhenOtherConnected(player){
        const newPlayerInGame = {
            ...playersInGameRef.current,
            players:[...playersInGameRef.current.players, player]
        }
        playersInGameRef.current = newPlayerInGame
        setPlayersInGame(newPlayerInGame)
    }
    function ManagePlayerDisconnected(disconnectPlayer){
        playersInGameRef.current = {
            players: playersInGameRef.current.players.filter(player => player.id !== disconnectPlayer.id),
            thisPlayer: playersInGameRef.current.thisPlayer,
        };
        setPlayersInGame(playersInGameRef.current)
    }
    function DisconnectSocketFromButton(){
        socket.disconnect()
        setIsIntoGameLobby(false)
        playersInGameRef.current = null
        setPlayersInGame(null)
    }

    const clickCard = (id)=>{
        alert(id)
        setCurrentCard(id)
        socket.emit('sent-card',id)
    }

    const componentStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
    };
    function CheckOwnerReadyButton(id){
        return userCookie.user.id === id
    }
    return (
        <div style={componentStyles}>
            <div className="background-image">

            </div>
            {/*waiting player*/}
            { isGameStarted ? <WaitingPlayer isOpen={true} DisconnectSocket={DisconnectSocketFromButton}/> : <WaitingPlayer isOpen={false} DisconnectSocket={DisconnectSocketFromButton}/>}
            <div className="content">
                <section className='top' >
                    <FriendCard cardName={friendCard_map}/>
                    <TrumpCard  cardName={trumpCard_map}/>
                    {/* <CardTable/> */}
                    <SettingsIcon className='setting' sx={{ fontSize: 50 }} />

                </section>
                <section className='left' >
                    {(
                        playersInGame?.players[1] && <PlayerCard2 name={playersInGame.players[1].username} isLeft={true}
                                                                bidScore={20} isPlay={turn[0]} isTop={true}
                                                                score={GameScore[0]} role = {role[0]}
                                                                 isOwnerReadyButton={CheckOwnerReadyButton(playersInGame?.players[1]?.id)}
                                                                 isHost={playersInGame.players[1].isOwner}
                                                                 isReady={playersInGame.players[1].isReady}
                                                                 socket={socket}
                                                                 setIsGameStarted={setIsGameStarted}
                                                                 isOwnerStartButton={playersInGame.players[1].isOwner && playersInGame.players[1].id === userCookie.user.id}
                        />
                    )}
                    {(
                        playersInGame?.players[3] && <PlayerCard2 name={playersInGame.players[3].username}   isLeft={true}
                                                                bidScore={20}  isPlay={turn[1]}
                                                                score={GameScore[1]} role = {role[1]}
                                                                 isOwnerReadyButton={CheckOwnerReadyButton(playersInGame.players[3].id)}
                                                                 isHost={playersInGame.players[3].isOwner}
                                                                 isReady={playersInGame.players[3].isReady}
                                                                 socket={socket}
                                                                 setIsGameStarted={setIsGameStarted}
                                                                 isOwnerStartButton={playersInGame.players[3].isOwner && playersInGame.players[3].id === userCookie.user.id}
                        />
                    )}
                </section>
                <section className='right'>
                    {(
                        playersInGame?.players[2] && <PlayerCard2 name={playersInGame.players[2].username} isLeft={false}
                                                                isPlay={turn[3]}
                                                                bidScore={20} score={GameScore[3]} role = {role[3]}
                                                                 isOwnerReadyButton={CheckOwnerReadyButton(playersInGame.players[2].id)}
                                                                 isHost={playersInGame.players[2].isOwner}
                                                                 isReady={playersInGame.players[2].isReady}
                                                                 socket={socket}
                                                                 setIsGameStarted={setIsGameStarted}
                                                                 isOwnerStartButton={playersInGame.players[2].isOwner && playersInGame.players[2].id === userCookie.user.id}
                        />
                    )}
                    {(
                        playersInGame?.players[0] && <PlayerCard2 name={playersInGame.players[0].username} isLeft={false}
                                                                bidScore={20}
                                                                isPlay={turn[2]}
                                                                score={GameScore[2]} role = {role[2]}
                                                                 isOwnerReadyButton={CheckOwnerReadyButton(playersInGame.players[0].id)}
                                                                 isHost={playersInGame.players[0].isOwner}
                                                                 isReady={playersInGame.players[0].isReady}
                                                                 socket={socket}
                                                                 setIsGameStarted={setIsGameStarted}
                                                                 isOwnerStartButton={playersInGame.players[0].isOwner && playersInGame.players[0].id === userCookie.user.id}
                        />
                    )}
                </section>

                <figure className='bot' style={{ paddingInlineStart: `${(n - 1) * offset}px` }}>


                    {cardInhand_map.map((e, i) => < CardInHand src={e.src} clickFunc={clickCard}
                                                               styles={{ ...picStyles, "right": i * offset }}
                                                               id = {e.id}
                    />)

                    }
                    {/* {cardInhand_map.map((e, i) => <img src={e} onClick={clickCard} style={{ ...picStyles, "right": i * offset }} alt="" />)} */}
                </figure>

                <section className='mid'>
                    {cardinfiled_map.map((e)=><img src={e}  alt="" />)}
                    {/*
            <img src={cardPath} alt="" />
            <img src={cardPath} alt="" />
            <img src={cardPath} alt="" /> */}

                    {/* <TotalScoreBoard/> */}
                </section>
                < SlideBar />
            </div>
        </div>
    )
}

InGameInterface2.propTypes = {
    socket: PropTypes.any,
    userCookie: PropTypes.object,
    setIsIntoGameLobby: PropTypes.func
}
export default InGameInterface2
