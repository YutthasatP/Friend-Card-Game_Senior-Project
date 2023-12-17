import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import PropTypes from "prop-types";
import { useState } from 'react';

const defaultTheme = createTheme();


export default function SignIn({onLogin, toggleSignUp}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit (event) {
        event.preventDefault();
        const user = await postSignIn(username, password)
        if (user) {
            console.log("login successfully")
            onLogin(user)
        }
        else{
            alert("login failed")
            console.log("login failed")
        }
    }

    async function postSignIn (username, password){
        try{
            const response = await axios.post(`${process.env.REACT_APP_SERVER_PORT}/users/login`, {
                username: username,
                password: password
            });
            return response.data
        }
        catch(error) {
            console.log('Error at sign in: ', error)
            return undefined
        }

    }

    function showSignUp(){
        toggleSignUp();
    }

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
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Box>
                                <Box>
                                    {"Don't have an account?"}
                                </Box>
                                <Box>
                                    <button onClick={showSignUp}> {"Sign Up"} </button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}

SignIn.propTypes = {
    onLogin: PropTypes.func,
    toggleSignUp: PropTypes.func
}