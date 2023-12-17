import '../ProfilePopup/ProfilePopUp.css'
import PropTypes from "prop-types";
import axios from "axios";
import {useEffect, useState} from "react";

export default function SearchLobbyPopUp({toggle, token, setRoomObjectFromCreateOrSearchLobby}) {
    const [roomJoinedData, setRoomJoinedData] = useState(null)
    const [roomPassword, setRoomPassword] = useState(null)

    useEffect(() => {
        if (roomJoinedData){
            let roomData = roomJoinedData
            roomData.roomPassword = roomPassword
            setRoomPassword(null)
            setRoomJoinedData(null)
            setRoomObjectFromCreateOrSearchLobby(roomData)
        }
    }, [roomJoinedData]);

    function close(){
        toggle()
    }
    async function submitJoinRoom(event){
        event.preventDefault()
        const formData = new FormData(event.target);
        const matchId = formData.get('matchId');
        const password = formData.get('password');
        if (password) { setRoomPassword(password.toString()) }
        await GetGameRoom(matchId)
    }
    async function GetGameRoom(matchId){
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_PORT}/games/${matchId}`,{
                headers: {
                    authorization: token
                }
            })
            setRoomJoinedData(response.data)
        }
        catch (error){
            console.log("Error when join room: ", error)
            alert(`join room failed: ${error}`)
        }
    }
    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Search Lobby</h2>

                <form onSubmit={submitJoinRoom}>
                    <label>
                        Match ID:
                    </label>
                    <input name={"matchId"} id={"matchId"}/>
                    <br/>

                    <label>
                        Password:
                    </label>
                    <input name={"password"} id={"password"} placeholder={"Optional"}/>
                    <br/>

                    <button type="submit">Join</button>
                </form>

                <button onClick={close}>Cancel</button>
            </div>
        </div>
    )
}

SearchLobbyPopUp.propTypes = {
    toggle: PropTypes.func,
    token: PropTypes.string,
    setRoomObjectFromCreateOrSearchLobby: PropTypes.func
}