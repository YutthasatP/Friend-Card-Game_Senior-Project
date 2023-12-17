import '../ProfilePopup/ProfilePopUp.css'
import PropTypes from "prop-types";
import axios from "axios";
import {useEffect, useState} from "react";

export default function CreateLobbyPopUp({toggle, token, setRoomObjectFromCreateOrSearchLobby}) {
    const [roomCreatedData, setRoomCreatedData] = useState(null)
    const [roomPassword, setRoomPassword] = useState(null)

    useEffect(() => {
        if (roomCreatedData){
            let roomData = roomCreatedData
            roomData.roomPassword = roomPassword
            setRoomPassword(null)
            setRoomCreatedData(null)
            setRoomObjectFromCreateOrSearchLobby(roomData)
            close()
        }

    }, [roomCreatedData]);

    function close(){
        toggle()
    }
    async function submitCreateRoom(event){
        event.preventDefault()
        const formData = new FormData(event.target);
        const lobbyName = formData.get('lobbyName');
        const password = formData.get('password');
        if (password) { setRoomPassword(password.toString()) }
        await PostCreateRoom(lobbyName, password)
    }
    async function PostCreateRoom(lobbyName, password){
        try {
            const body = {
                gameType: "FRIENDCARDGAME",
                maxPlayers: 4,
                password: password ? password : null,
                roomName: lobbyName
            }
            const header = {
                authorization: token
            }
            const response = await axios.post(`${process.env.REACT_APP_SERVER_PORT}/games`, body, {
                headers: header
            })
            setRoomCreatedData(response.data)
        }
        catch (error){
            console.log("Error when create room: ", error)
            alert(`create room failed: ${error}`)
        }
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Create Lobby</h2>

                <form onSubmit={submitCreateRoom}>
                    <label>
                        Lobby Name:
                    </label>
                    <input name={"lobbyName"} id={"lobbyName"}/>
                    <br/>

                    <label>
                        Password:
                    </label>
                    <input name={"password"} id={"password"} placeholder={"Optional"}/>
                    <br/>

                    <button type="submit">Create</button>
                </form>

                <button onClick={close}>Cancel</button>
            </div>
        </div>
    )
}

CreateLobbyPopUp.propTypes = {
    toggle: PropTypes.func,
    token: PropTypes.string,
    setRoomObjectFromCreateOrSearchLobby: PropTypes.func
}