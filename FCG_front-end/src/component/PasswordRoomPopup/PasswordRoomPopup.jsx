import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from "prop-types";

export default function PasswordRoomPopup({setPasswordForConnect, isShowPasswordPopup, setIsShowPasswordPopup, setRoomObjectForConnect}) {
    const [password, setPassword] = useState('');

    const handleClose = () => {
        setIsShowPasswordPopup(false);
        setRoomObjectForConnect(null);
    };

    const handleEnter = () => {
        if (password === '' || password === null || password === undefined){
            alert("please enter password");
        }
        else{
            setPasswordForConnect(password)
        }
    };

    return (
        <>
            <Dialog open={isShowPasswordPopup} onClose={handleClose}>
                <DialogTitle>Enter Room Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleEnter}>Enter</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

PasswordRoomPopup.propTypes = {
    setPasswordForConnect: PropTypes.func,
    isShowPasswordPopup: PropTypes.bool,
    setIsShowPasswordPopup: PropTypes.func,
    setRoomObjectForConnect: PropTypes.func
}
