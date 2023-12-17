import './ProfilePopUp.css'
import PropTypes from "prop-types";

export default function ProfilePopUp({toggle, onLogout}) {

    function close(){
        toggle()
    }
    function logout(){
        onLogout()
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Profile</h2>
                <label>
                    Username:
                </label>
                <button onClick={logout}>Logout Button</button>
                <br/>
                <button onClick={close}>Close Button</button>
            </div>
        </div>
    )
}

ProfilePopUp.propTypes = {
    toggle: PropTypes.func,
    onLogout: PropTypes.func
}