import {useEffect, useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { io } from "../../../node_modules/socket.io-client/dist/socket.io.esm.min.js";
import CreateLobbyPopUp from "../../component/CreateLobbyPopUp/CreateLobbyPopUp.jsx";
import PasswordRoomPopup from "../../component/PasswordRoomPopup/PasswordRoomPopup.jsx";
import SearchLobbyPopUp from "../../component/SearchLobbyPopup/SearchLobbyPopup.jsx";
// import InLobby from "../InLobby.jsx";
import InGameInterface2 from "../InGameInterface2.jsx";
import {log} from "tailwindcss/lib/cli/utils.js";

export default function LobbyList({userCookie, setIsInManu, setIsInLobbyList}){
    const [allRooms, setAllRooms] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isIntoGameLobby, setIsIntoGameLobby] = useState(false);
    const [socket, setSocket] = useState(null)
    const [isShowCreateLobbyPopup, setIsShowCreateLobbyPopup] = useState(false)
    const [isShowSearchLobbyPopup, setIsShowSearchLobbyPopup] = useState(false)
    const [roomObjectFromCreateOrSearchLobby, setRoomObjectFromCreateOrSearchLobby] = useState(null)
    const [isShowPasswordPopup, setIsShowPasswordPopup] = useState(false)
    const [roomObjectForConnect, setRoomObjectForConnect] = useState(null)
    const [passwordForConnect, setPasswordForConnect] = useState("")
    // const [playersInGame, setPlayersInGame] = useState(null)

    useEffect(() => {
        FetchRoom().then()
    }, []);

    useEffect(() => {
        if (socket){
            let success = true;
            socket.on('connect_error', (error) => {
                success = false
                alert(error)
            });
            // socket.connect();
            // socket.on("players_in_game", result => { setPlayersInGame(result); })
            // console.log("socket connected")
            setTimeout(() => {
                if (success) {
                    console.log("Loading")
                    setIsIntoGameLobby(true)
                }
            }, 500);
        }
    }, [socket]);

    /// connect room from create or search room
    useEffect(() => {
        if (roomObjectFromCreateOrSearchLobby){
            const query = {
                token: userCookie.token,
                gameId: roomObjectFromCreateOrSearchLobby.id,
                password: roomObjectFromCreateOrSearchLobby.roomPassword
            }
            try {
                ConnectToGameRoom(query)
            }
            catch (error){
                console.log("Error when connect to socket: ", error)
                alert(`Error: ${error}`)
                FetchRoom().then()
            }
        }
    }, [roomObjectFromCreateOrSearchLobby]);

    /// connect when clicked to the room
    useEffect(() => {
        if (roomObjectForConnect){
            JoinRoom().then()
            setPasswordForConnect("")
        }
    }, [roomObjectForConnect, passwordForConnect]);

    // function addPlayerInRoomWhenOtherConnected(player){
    //     const newPlayerInGame = {
    //         ...playersInGame,
    //         players:[...playersInGame.players, player]
    //     }
    //     console.log("newPlayerInGame asdasd:", JSON.stringify(newPlayerInGame))
    //
    //     setPlayersInGame(newPlayerInGame)
    //     console.log("playersInGame asdasd:", JSON.stringify(playersInGame))
    // }
    async function FetchRoom(){
        try{
            console.log("fetch room!")
            const response = await axios.get(`${process.env.REACT_APP_SERVER_PORT}/games`,{
                headers: {
                    authorization: userCookie.token
                }
            })
            setAllRooms(response.data)
        }catch(error){
            console.log("Error at Lobby List: ", error)
        }
    }

    function BackToManu(){
        setIsInManu(true)
        setIsInLobbyList(false)
    }

    async function JoinRoom(){
        if(roomObjectForConnect && roomObjectForConnect.isPasswordProtected && passwordForConnect === ""){
            setIsShowPasswordPopup(true)
        }
        else if (roomObjectForConnect && roomObjectForConnect.isPasswordProtected && passwordForConnect !== ""){
            const query = {
                token: userCookie.token,
                gameId: roomObjectForConnect.id,
                password: passwordForConnect
            }
            try {
                ConnectToGameRoom(query)
                if (isShowPasswordPopup) { setIsShowPasswordPopup(!isShowPasswordPopup) }
            }
            catch (error){
                console.log("Error when connect to socket: ", error)
                alert(`Error: ${error}`)
                FetchRoom().then()
            }
        }
        else if (roomObjectForConnect && !roomObjectForConnect.isPasswordProtected){
            const query = {
                token: userCookie.token,
                gameId: roomObjectForConnect.id
            }
            try {
                ConnectToGameRoom(query)
            }
            catch (error){
                console.log("Error when connect to socket: ", error)
                alert(`Error: ${error}`)
                FetchRoom().then()
            }
        }
    }
    function ConnectToGameRoom(query){
        // console.log("socket connection: ", socketConnection)
        setSocket(io(`${process.env.REACT_APP_SERVER_PORT}/FRIENDCARDGAME`, {
            query: query,
            autoConnect: false,
        }))
        // try {
        //     const socketConnection = io(`${process.env.REACT_APP_SERVER_PORT}/FRIENDCARDGAME`, {
        //         query: query,
        //         autoConnect: false,
        //     })
        //     // console.log("socket connection: ", socketConnection)
        //     setSocket(socketConnection)
        // }
        // catch (e) {
        //     setSocket(null)
        // }
        // console.log("socket: ", socket)
    }
    function toggleCreateLobbyPopup(){
        setIsShowCreateLobbyPopup(!isShowCreateLobbyPopup)
    }
    function toggleSearchLobbyPopup(){
        setIsShowSearchLobbyPopup(!isShowSearchLobbyPopup)
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const columns = [
        { id: 'matchId', label: 'MatchID', minWidth: 170 },
        { id: 'status', label: 'Status', minWidth: 170 },
        { id: 'owner', label: 'Owner', minWidth: 170 },
        { id: 'lobbyName', label: 'Lobby\u00a0Name', minWidth: 170 },
    ];

    function GetCellValue(row, columeId){
        let value = ""
        switch (columeId){
            case "matchId":
                value = row["id"]
                break;
            case "status":
                value = row["numPlayersInGame"] === 4 ? "In Game" : `${row["numPlayersInGame"].toString()}/4`
                break;
            case "owner":
                value = row?.owner?.username
                break;
            case "lobbyName":
                value = row["roomName"]
                break;
            default:
                break;
        }
        return value
    }

    function Render(){
        if (!isIntoGameLobby){
            return (
                <>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                {/*<TableHead>*/}
                                {/*    <TableRow>*/}
                                {/*    }}>*/}
                                {/*        {columns.map((column) => (*/}
                                {/*            <TableCell*/}
                                {/*                key={column.id}*/}
                                {/*                align={column.align}*/}
                                {/*                style={{ minWidth: column.minWidth }}*/}
                                {/*            >*/}
                                {/*                {column.label}*/}
                                {/*            </TableCell>*/}
                                {/*        ))}*/}
                                {/*    </TableRow>*/}
                                {/*</TableHead>*/}
                                <TableBody>
                                    {allRooms
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow onClick={() => setRoomObjectForConnect(row)} hover role="checkbox" tabIndex={-1} key={row.id}>
                                                    {columns.map((column) => {
                                                        const value = GetCellValue(row, column.id)
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={allRooms.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />


                        <button onClick={() => FetchRoom()}>
                            REFRESH
                        </button>
                        <br/>
                        <button onClick={() => toggleCreateLobbyPopup()}>
                            CREATE
                        </button>
                        <br/>
                        <button onClick={() => toggleSearchLobbyPopup()}>
                            SEARCH
                        </button>
                        <br/>
                        <button onClick={() => BackToManu()}>
                            BACK
                        </button>

                    </Paper>
                    { isShowCreateLobbyPopup ?
                        <CreateLobbyPopUp
                            toggle={toggleCreateLobbyPopup}
                            token={userCookie.token}
                            setRoomObjectFromCreateOrSearchLobby={setRoomObjectFromCreateOrSearchLobby}
                        />: null
                    }
                    { isShowPasswordPopup ?
                        <PasswordRoomPopup
                            setPasswordForConnect={setPasswordForConnect}
                            isShowPasswordPopup={isShowPasswordPopup}
                            setIsShowPasswordPopup={setIsShowPasswordPopup}
                            setRoomObjectForConnect={setRoomObjectForConnect}
                        /> : null
                    }
                    { isShowSearchLobbyPopup ?
                        <SearchLobbyPopUp
                            toggle={toggleSearchLobbyPopup}
                            token={userCookie.token}
                            setRoomObjectFromCreateOrSearchLobby={setRoomObjectFromCreateOrSearchLobby}
                        />: null
                    }
                </>
            )
        }
        else {
            return(
                <>
                    <InGameInterface2
                        userCookie={userCookie}
                        socket={socket}
                        setIsIntoGameLobby={setIsIntoGameLobby}
                    />
                    {/*<InLobby />*/}
                </>
            )
        }
    }

    return (
        <>
            {Render()}
        </>
    )
}

LobbyList.propTypes = {
    userCookie: PropTypes.object,
    setIsInManu: PropTypes.func,
    setIsInLobbyList: PropTypes.func
}