import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import './styles.css';

const InstructorDashboard = (props) => {
    const navigate = useNavigate();

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        props.setLoggedIn(false); // Update the logged-in status in the parent component if applicable
        navigate("/login"); // Navigate back to the login page
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Welcome!</div>
            </div>
            <div className="subTitleContainer">
                <div>This is the Student Dashboard.</div>
                <div>It's currently under construction!</div>
            </div>
            <br />
            <div className={"inputContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={handleLogout}
                value={"Log out"} />
            </div>
        </div>
    );
};

export default InstructorDashboard