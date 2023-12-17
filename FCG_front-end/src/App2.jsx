import { CookiesProvider, useCookies } from "react-cookie";
import SignIn from "./interface/Login/SingIn.jsx";
import SignUp from "./interface/Login/SignUp.jsx";
import Manu from "./interface/FriendCardGame/Manu.jsx";
import {useState} from "react";

export default function App2(){
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [isShownSignUp, setShownSignUp] = useState(false)

    function handleLogin(user) {
        setCookie("user", user, { path: "/" });
    }
    function handleLogOut(){
        removeCookie('user');
    }
    function toggleIsShownSignUp () {
        setShownSignUp(!isShownSignUp);
    }

    function render(){
        if (cookies.user){
            return (
                <Manu
                    userCookie={cookies.user}
                    onLogout={handleLogOut}
                />
            )
        }
        else if (!cookies.user && !isShownSignUp){
            return(
                <SignIn onLogin={handleLogin} toggleSignUp={toggleIsShownSignUp} />
            )
        }
        else {
            return (
                <SignUp onLogin={handleLogin} toggleSignUp={toggleIsShownSignUp}/>
            )
        }
    }

    return (
        <>
            <CookiesProvider>
                <div> {render()} </div>
            </CookiesProvider>
        </>
    )
}