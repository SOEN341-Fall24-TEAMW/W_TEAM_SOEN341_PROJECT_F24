import React from "react"
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    const { loggedIn, email } = props
    const navigate = useNavigate();
    
    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }


    return <div className="mainContainer">
        <img src="/team-logo.png" alt="Team Logo" style={{ maxHeight: "350px" }} />
        <div className={"titleContainer"}>
            <div>TEAM W!</div>
        </div>
        <div>
            This is our peer review web application.
        </div>
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={loggedIn ? "Log out" : "Log in"} />
            {(loggedIn ? <div>
                Your email address is {email}
            </div> : <div/>)}
        </div>


    </div>
}

export default Home