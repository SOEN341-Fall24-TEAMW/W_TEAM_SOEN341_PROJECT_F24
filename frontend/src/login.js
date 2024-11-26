import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, TextInput, Button, Space, PasswordInput, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import PropTypes from 'prop-types';


const Login = ({ role, setRole, email, setEmail, loggedIn, setLoggedIn }) => {

    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [roleError, setRoleError] = useState("");

    const navigate = useNavigate();
    const [visible, { toggle }] = useDisclosure(false);
    let hasError = false;


    useEffect(() => {
        if (!loggedIn) {
            setRole("");
            setEmail("");
        }
    }, [loggedIn, setEmail, setRole]);


    const onButtonClick = () => {

        // Set initial error values to empty
        setEmailError("");
        setPasswordError("");
        setRoleError("");

        // Check if the user has entered both fields correctly
        if (!role) {
            setRoleError("Please select a role");
            hasError = true;
        }

        if (!email) {
            setEmailError("Please enter your email");
            hasError = true;
        }

        if (!/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email");
            hasError = true;
        }

        if (!password) {
            setPasswordError("Please enter a password");
            hasError = true;
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // Check if email has an account associated with it
        checkAccountExists(accountExists => {
            // If yes, log in 
            if (accountExists)
                logIn();
            else
                // Else, ask user if they want to create a new account and if yes, then log in
                if (window.confirm("An account does not exist with this email address: " + email + ". Do you want to create a new account?")) {
                    navigate('/create-new-account');
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
            body: JSON.stringify({ email })
        })
            .then(r => r.json())
            .then(r => {
                callback(r?.userExists)
            })
    }

    // Log in a user using email and password
    const logIn = () => {
        fetch("http://localhost:3080/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        })
            .then(r => r.json())
            .then(r => {
                if ('success' === r.message) {
                    console.log("r: ", r);
                    localStorage.setItem("id", r.id);
                    localStorage.setItem("user", JSON.stringify({ email, token: r.token }));
                    localStorage.setItem("role", JSON.stringify(r.role));
                    localStorage.setItem("jwt-token", r.token);
                    setLoggedIn(true);
                    setEmail(email);
                    setTimeout(() => {
                        if (role === "student") {
                            navigate("/student-dashboard");
                        } else if (role === "instructor") {
                            navigate("/instructor-dashboard");
                        }
                    }, 0);
                } else {
                    window.alert(r.message);
                }
            })
    }

    return <div className={"mainContainer"} style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "justify", padding: 40 }}>
            <img src="/team-logo.svg" alt="Team Logo" style={{ maxWidth: "335.18px", padding: "20px" }} />
            <Space h="lg" />
            <Space h="lg" />
            <div style={{ fontSize: 28 }}>
                Web-based Peer Assessment <br />
                and Team Coordination Hub
            </div>
        </div>
        <div style={{ height: 300, width: 1, backgroundColor: "#d3d3d3" }}></div>
        <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            margin: 40, padding: 40, backgroundColor: "#fff", border: "none", borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)", boxSizing: "border-box"
        }}
        >
            <form onSubmit={onButtonClick}>
                <Select
                    label={"Role"}
                    placeholder="Select a Role"
                    data={['student', 'instructor']}
                    value={role ? role : null}
                    onChange={(value) => { setRole(value); setRoleError(""); }}
                    style={{ width: 335.14, fontSize: 24, borderRadius: 11, margin: 0, padding: 0 }}
                    withAsterisk
                    error={roleError ? roleError : ""}
                    clearable />
                <TextInput
                    value={email}
                    label="Enter your email address:"
                    placeholder={"Email Address"}
                    withAsterisk
                    onChange={ev => { setEmail(ev.target.value); setEmailError(""); }}
                    style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
                    error={emailError ? emailError : ""}
                />
                <Space h={emailError ? "xl" : "sm"} />
                <PasswordInput
                    value={password}
                    label="Password"
                    placeholder="Password"
                    visible={visible}
                    onVisibilityChange={toggle}
                    withAsterisk
                    onChange={ev => { setPassword(ev.target.value); setPasswordError(""); }}
                    style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
                    error={passwordError ? passwordError : ""}
                />
                <Space h={passwordError ? "xl" : "lg"} />
                <Button
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    onClick={onButtonClick}
                    style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11, marginTop: "20px" }}
                >{"Login"}</Button>
            </form>
            <Divider my="sm" />
            <div style={{ height: 1, width: 300, backgroundColor: "#d3d3d3" }}></div>
            <Divider my="sm" />
            <Button
                variant="gradient"
                gradient={{ from: 'green', to: 'cyan', deg: 90 }}
                onClick={() => navigate('/create-new-account')}
                style={{ width: "fit-content", height: 50, fontSize: 20, borderRadius: 11 }}
            >{"Create new account"}</Button>
        </div>
    </div>
}

Login.propTypes = {
    role: PropTypes.string.isRequired,        // Assuming role is a string
    setRole: PropTypes.func.isRequired,       // setRole is a function
    email: PropTypes.string.isRequired,       // Assuming email is a string
    setEmail: PropTypes.func.isRequired,      // setEmail is a function
    loggedIn: PropTypes.bool.isRequired,      // loggedIn is a boolean
    setLoggedIn: PropTypes.func.isRequired,   // setLoggedIn is a function
  };

export default Login