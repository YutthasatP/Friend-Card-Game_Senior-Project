import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useState} from "react";
import ProfilePopUp from "../../component/ProfilePopup/ProfilePopUp.jsx";
import Button from 'react-bootstrap/Button';
import LobbyList from "./LobbyList.jsx";

const defaultTheme = createTheme();

export default function Manu({userCookie, onLogout}) {

    const [isShowProfilePopUp, setIsShowProfilePopUp] = useState(false)
    const [isInLobbyList, setIsInLobbyList] = useState(false)
    const [isInManu, setIsInManu] = useState(true)

    function toggleProfile(){
        setIsShowProfilePopUp(!isShowProfilePopUp)
    }
    function settingClicked(){
        alert("setting clicked")
    }
    function playClicked(){
        setIsInManu(false)
        setIsInLobbyList(true)
    }
    function soloClicked(){
        alert("SOLO clicked")
    }
    function howToPlayClicked(){
        alert("HOW TO PLAY clicked")
    }

    function button(clickMethod, text){
        return (
            <Button variant="primary" onClick={clickMethod}>
                {text}
            </Button>
        )
    }
    function render(){
        if (isInManu && !isInLobbyList){
            return (
                <>
                    <ThemeProvider theme={defaultTheme}>
                        <Container component="main" maxWidth="xs">
                            <CssBaseline />
                            <Box
                                sx={{
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography component="h1" variant="h5">
                                    Friend Card Game
                                </Typography>
                                {button(toggleProfile, `username: ${userCookie.user.username} | UID: ${userCookie.user.id}`)}
                                {button(settingClicked, `Setting`)}
                                {button(playClicked, `PLAY`)}
                                {button(soloClicked, `SOLO`)}
                                {button(howToPlayClicked, `HOW TO PLAY`)}
                            </Box>
                        </Container>
                    </ThemeProvider>
                    { isShowProfilePopUp ? <ProfilePopUp toggle={toggleProfile} onLogout={onLogout}/> : null }
                </>
            )
        }
        else if (!isInManu && isInLobbyList){
            return (
                <>
                    <LobbyList userCookie={userCookie} setIsInManu={setIsInManu} setIsInLobbyList={setIsInLobbyList}/>
                </>
            )
        }
    }
    return (
        <> {render()} </>
    )
}

Manu.propTypes = {
    userCookie: PropTypes.shape({
        user: PropTypes.shape({
            id: PropTypes.string,
            username: PropTypes.string
        }),
        token: PropTypes.string
    }),
    onLogout: PropTypes.func
}