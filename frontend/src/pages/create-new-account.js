import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateNewAccount = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [id, setId] = useState("");
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [roleError, setRoleError] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [idError, setIdError] = useState("");

    const navigate = useNavigate();
        
    const onButtonClick = () => {

        // Set initial error values to empty
        setEmailError("")
        setPasswordError("")

        // Check if the user has entered both fields correctly
        if (firstName === "") {
            setFirstNameError("Please enter your  first name");
            return;
        }
        if (lastName === "") {
            setLastNameError("Please enter your last name");
            return;
        }

        if ((role === "student") && id === "") {
            setIdError("Please enter your student Id");
            return
        }

        if ("" === email) {
            setEmailError("Please enter your email")
            return
        }

        if (!/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email")
            return
        }

        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }

        if (role === "Select Role") {
            setRoleError("Please select a role");
            return;
        }

        // Check if email has an account associated with it
        checkAccountExists(accountExists => {
            console.log("here");
            // If yes, log in 
            if (accountExists && window.confirm("An account already exists with this email address: " + email + ". Do you want to navigate to the login page?")){
                navigate("/login");
            }
            // Else, ask user if they want to create a new account and if yes, then log in
            if ((accountExists === false) && window.confirm("An account does not exist with this email address: " + email + ". Do you want to create a new account?")) {
                createAccount();
            } else {
                return;
            }
        })        

    }

    // Call the server API to check if the given email ID already exists
    const checkAccountExists = (callback) => {
        fetch("http://localhost:3080/check-account", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email})
        })
        .then(r => r.json())
        .then(r => {
            callback(r?.userExists)
        })
    }

    const createAccount = () => {
        fetch ("http://localhost:3080/create-account", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ role, firstName, lastName, id, email, password })
        })
        .then(r => r.json())
        .then(r => {
            if ('success' === r.message){
                navigate('/login');
            } else {
                window.alert(r.message);
            }
        })
    }

    return <div className={"mainContainer"}>
        <div className={"titleContainer"}>
            <div>Welcome!</div>
        </div>
        <div className="subTitleContainer">
            <div>Here you can create a new account</div>
        </div>
        <br />
        <div className="inputContainer">
            <select value={role} onChange={(ev) => setRole(ev.target.value)} className="inputBox">
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
            </select>
            <label className="errorLabel">{roleError}</label>
        </div>
        <div className={"inputContainer"}>
            <input
                value={firstName}
                placeholder="Enter your first name"
                onChange={ev => setFirstName(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{firstNameError}</label>
            <input
                value={lastName}
                placeholder="Enter your last name"
                onChange={ev => setLastName(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{lastNameError}</label>
        </div>
        {(role === 'student') && (<div className={"inputContainer"}>
            <input
                value={id}
                placeholder="Enter your id"
                onChange={ev => setId(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{idError}</label>
        </div>)
        }
        <div className={"inputContainer"}>
            <input
                value={email}
                placeholder="Enter your email here"
                onChange={ev => setEmail(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{emailError}</label>
        </div>
        <div className={"inputContainer"}>
            <input
                type="password"
                value={password}
                placeholder="Enter your password here"
                onChange={ev => setPassword(ev.target.value)}
                className={"inputBox"} />
            <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={"Sign Up"} />
        </div>
    </div>
}

export default CreateNewAccount