import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, TextInput, Button, Space, Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [role, setRole] = useState("");
    const [roleError, setRoleError] = useState("");

    const navigate = useNavigate();

    const icon = <IconAlertTriangle />;

    const onButtonClick = () => {

        // Set initial error values to empty
        setEmailError("");
        setPasswordError("");
        setRoleError("");

        // Check if the user has entered both fields correctly
        if (role === "") {
            setRoleError("Please select a role");
            return;
        }

        if ("" === email) {
            setEmailError("Please enter your email");
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
                    localStorage.setItem("user", JSON.stringify({ email, token: r.token }))
                    localStorage.setItem("jwt-token", r.token);
                    props.setLoggedIn(true);
                    props.setEmail(email);
                    navigate("/");
                    if (role === "student") {
                        navigate("/student-dashboard");
                    } else if (role === "instructor") {
                        navigate("/instructor-dashboard");
                    }
                } else {
                    window.alert(r.message);
                }
            })
    }

    return <div className={"mainContainer"} style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "left", padding: 40 }}>
            <img src="/team-logo.svg" alt="Team Logo" style={{ maxWidth: "335.18px" }} />
            <Space h="lg" />
            <Space h="lg" />
            <div style={{ fontSize: 28 }}>
                Work Assessment <br />
                and Team Coordination Hub
            </div>
        </div>
        <div style={{ height: 300, width: 1, backgroundColor: "#d3d3d3" }}></div>
        <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            margin : 40 , padding: 40, backgroundColor: "#fff", border: "none", borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)", boxSizing: "border-box"
        }}
        >
            <Select
                label={"Role"}
                placeholder="Select a Role"
                data={['student', 'instructor']}
                value={role ? role : null}
                onChange={(value) => setRole(value)}
                style={{ width: 335.14, fontSize: 24, borderRadius: 11, margin: 0, padding: 0 }}
                clearable />
            <Space h="sm" />
            {(roleError !== "") && <Alert variant="light" color="red" title="Email Alert" icon={icon}>{roleError}</Alert> && <Space h="sm" />}
            <TextInput
                value={email}
                label="Enter your email address:"
                placeholder="Email Adress"
                onChange={ev => setEmail(ev.target.value)}
                style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
            />
            <Space h="sm" />
            {(emailError !== "") && <Alert variant="light" color="red" title="Email Error" icon={icon}>{emailError}</Alert> && <Space h="sm" />}
            <TextInput
                value={password}
                label="Password"
                placeholder="Password"
                type="password"
                onChange={ev => setPassword(ev.target.value)}
                style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
            />
            <Space h="sm" />
            {(passwordError !== "") && <Alert variant="light" color="red" title="Password Error" icon={icon}>{passwordError}</Alert > && <Space h="sm" />}
            <Space h="lg" />
            <Button
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                onClick={onButtonClick}
                style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
            >{"Login"}</Button>
        </div>
    </div>
}

export default Login