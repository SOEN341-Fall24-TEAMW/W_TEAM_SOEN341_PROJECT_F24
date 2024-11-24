import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Button, TextInput, Select, Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';


const CreateNewAccount = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [id, setId] = useState("");
    const [organizationId, setOrganizationId] = useState("");
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [roleError, setRoleError] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [idError, setIdError] = useState("");
    const [organizationIdError, setOrganizationIdError] = useState("");

    const navigate = useNavigate();

    const icon = <IconAlertTriangle />;

    const onButtonClick = async () => {

        // Set initial error values to empty
        setRoleError("");
        setFirstNameError("");
        setLastNameError("");
        setIdError("");
        setEmailError("");
        setPasswordError("");
        setOrganizationIdError("");

        let hasError = false;

        // Check if the user has entered both fields correctly
        if (!role) {
            setRoleError("Please select a role");
            hasError = true;
        }

        if ((role === "student") && !id) {
            setIdError("Please enter your student Id");
            hasError = true;
        }

        if (!firstName) {
            setFirstNameError("Please enter your  first name");
            hasError = true;
        }
        if (!lastName) {
            setLastNameError("Please enter your last name");
            hasError = true;
        }

        if (!email) {
            setEmailError("Please enter your email")
            hasError = true;
        }

        if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
            setEmailError("Please enter a valid email")
            hasError = true;
        }

        if (!password) {
            setPasswordError("Please enter a password")
            hasError = true;
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer")
            hasError = true;
        }

        if (!organizationId) {
            setOrganizationIdError("Please select an organization");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // Check if email has an account associated with it
        checkAccountExists(accountExists => {
            console.log("here");
            // If yes, log in 
            if (accountExists && window.confirm("An account already exists with this email address: " + email + ". Do you want to navigate to the login page?")) {
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

    const organization_list = [{ name: 'Concordia University', id: 'org1' }, { name: 'McGill University', id: 'org2' }, { name: 'Université de Montréal', id: 'org3' }, { name: 'Université du Québec à Montréal', id: 'org4' }, { name: 'École de technologie supérieure', id: 'org5' }, { name: 'Polytechnique Montréal', id: 'org6' }];

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

    const createAccount = () => {
        fetch("http://localhost:3080/create-account", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role, firstName, lastName, id, email, password, organizationId })
        })
            .then(r => r.json())
            .then(r => {
                if ('success' === r.message) {
                    navigate('/login');
                } else {
                    window.alert(r.message);
                }
            })
    }

    return <div className={"mainContainer"} style={{ display: "flex", flexDirection: "row" }}>
        <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            margin: 40, padding: 40, backgroundColor: "#fff", border: "none", borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)", boxSizing: "border-box"
        }}
        >
            <Select
                label={"Role"}
                placeholder="Select a Role"
                role="roles"
                data={['student', 'instructor']}
                value={role ? role : ""}
                onChange={(value) => { setRole(value); setRoleError(""); } }
                style={{ width: 335.14, fontSize: 24, borderRadius: 11, margin: 0, padding: 0 }}
                clearable
                error={roleError ? roleError : ""}
            />
            {(role === 'student') && <>
                <TextInput
                    value={id}
                    label="Enter your student ID:"
                    placeholder="Student ID"
                    onChange={ev => { setId(ev.target.value); setIdError(""); }}
                    style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
                    error={idError ? idError : ""}
                />
                <Space h={idError ? "lg" : "sm"} />
            </>}
            <TextInput
                value={firstName}
                label="Enter your first name:"
                placeholder="First Name"
                onChange={ev => { setFirstName(ev.target.value); setFirstNameError(""); }}
                style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
                error={firstNameError ? firstNameError : ""}
            />
            <Space h={firstNameError ? "lg" : "sm"} />
            <TextInput
                value={lastName}
                label="Enter your last name:"
                placeholder="Last Name"
                onChange={ev => { setLastName(ev.target.value); setLastNameError(""); }}
                style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
                error={lastNameError ? lastNameError : ""}
            />
            <Space h={lastNameError ? "lg" : "sm"} />
            <TextInput
                value={email}
                label="Enter your email address:"
                placeholder="Email Adress"
                onChange={ev => { setEmail(ev.target.value); setEmailError(""); }}
                style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
                error={emailError ? emailError : ""}
            />
            <Space h={emailError ? "lg" : "sm"} />
            <TextInput
                value={password}
                label="Password"
                placeholder="Password"
                type="password"
                onChange={ev => { setPassword(ev.target.value); setPasswordError(""); }}
                style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
                error={passwordError ? passwordError : ""}
            />
            <Space h={passwordError ? "lg" : "sm"} />
            <Select
                label="Choose an existing organization"
                role="orgDropdown"
                placeholder="Select Organization"
                data={organization_list.map((org) => ({ value: org.id, label: org.name }))}
                value={organizationId}
                style={{ width: 335.14, fontSize: 24, borderRadius: 11, margin: 0, padding: 0 }}
                onChange={(value) => { setOrganizationId(value); setOrganizationIdError(''); }}
                error={organizationIdError ? organizationIdError : ""}
            />
            <Space h="lg" />
            <Button
                variant="gradient"
                gradient={{ from: 'green', to: 'cyan', deg: 90 }}
                onClick={onButtonClick}
                style={{ width: 335.14, height: 60, fontSize: 24, borderRadius: 11 }}
            >{"Create Account"}</Button>
        </div>
    </div>
}

export default CreateNewAccount