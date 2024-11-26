import React from "react"
import { useNavigate } from "react-router-dom";
import { Flex, Space, Button } from '@mantine/core';
import PropTypes from 'prop-types';

const Home = (props) => {
    const { loggedIn, email, setLoggedIn } = props;
    const navigate = useNavigate();



    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }

    setLoggedIn(false);

    const value = loggedIn ? "Log out" : "Get Started →";


    return <div className="mainContainer">
        <Flex>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                <img src="/team-logo.svg" alt="Team Logo" style={{ maxWidth: "335.18px" }} />
                <Space h="lg" />
                <Space h="lg" />
                <div style={{ fontSize: 28 }}>
                    Work Assessment <br />
                    and Team Coordination Hub
                </div>
                <Space h="lg" />
                <Space h="lg" />
                <Button
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    onClick={onButtonClick}
                    style={{ width: "fit-content", height: 50, fontSize: 20, borderRadius: 11 }}
                >{value}</Button>
                {(loggedIn ? <div style={{ fontSize: 24 }}>
                    Your email address is {email}
                </div> : <div />)}
            </div>
        </Flex>


    </div>
}

Home.propTypes = {
    loggedIn: PropTypes.bool.isRequired,  // Assuming loggedIn is a boolean
    email: PropTypes.string.isRequired,   // Assuming email is a string
    setLoggedIn: PropTypes.func.isRequired,  // Assuming setLoggedIn is a function
  };
  
export default Home