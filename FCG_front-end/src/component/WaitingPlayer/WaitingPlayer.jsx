import {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import "./WaitingPlayer.css"
export default function WaitingPlayer({isOpen, DisconnectSocket}){
    const [isComponentVisible, setComponentVisible] = useState(true);

    useEffect(() => {
        setComponentVisible(!isOpen)
    }, [isOpen]);

    function AddBot(){
        alert("Add bot clicked")
    }
    function QuitLobby(){
        const response = confirm("Quit lobby")
        if(response) {
            DisconnectSocket()
            setComponentVisible(false)
        }
    }

    const componentStyles = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px', // Set the desired width
        height: '200px', // Set the desired height
        backgroundColor: '#f0f0f0', // Optional: add styling for background color or other styles
        border: '1px solid #ccc', // Optional: add styling for borders
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: add a box shadow
        zIndex: 10000, // Optional: set a z-index to control stacking order
    };
    return (
        <>
            {isComponentVisible && (
                <div className='menu_border' style={componentStyles}>
                    <p>
                        Waiting for Player
                    </p>
                    <br/>
                    <button
                        onClick={AddBot}
                        className="add_bot_button bg-black hover:bg-blue-700 text-white font-bold py-2  border border-blue-700 rounded-2xl"
                    >Add Bot</button>
                    <br/>
                    <button
                        onClick={QuitLobby}
                        className="quit_button bg-black hover:bg-blue-700 text-white font-bold py-2  border border-blue-700 rounded-2xl"
                    >Quit Lobby</button>
                </div>
            )}
        </>
    )
}

WaitingPlayer.propTypes = {
    isOpen: PropTypes.bool,
    DisconnectSocket: PropTypes.func
}