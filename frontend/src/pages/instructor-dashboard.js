import React, { useState } from "react";
import DropdownMenu from '../drop-down-menu';
import './styles.css';

const InstructorDashboard = () => {

    const [selectedOption, setSelectedOption] = useState("");
    const [navBarTabSelected, setNavBarTabSelected] = useState("");

    const tabs = ['Teams', 'Students', 'Admin'];

    // Handle dropdown selection change
    var handleDropdownSelect = (value) => {
        setSelectedOption(value);
        console.log("Selected option:", value);
    };

    var handleClick = (tab) => {
        setNavBarTabSelected(tab);
    }

    return (
        <div className={"mainContainer"}>
            <div className={'navBar'}>
            {tabs.map((tab, index) => (
                    <input
                        key={index} // Unique key for each tab
                        className={'inputButton'}
                        id={navBarTabSelected === tab ? 'navBarTabSelected' : 'navBarTab'}
                        type="button"
                        value={tab}
                        onClick={() => handleClick(tab)} // Correct way to pass the tab as an argument
                    />
                ))}
            </div>
            <div className={"titleContainer"}>
                <div>Welcome!</div>
            </div>
            <div className="subTitleContainer">
                <div>This is the Instructor Dashboard.</div>
                <div>It's currently under construction!</div>
            </div>
            {/* Add a DropdownMenu component */}
            <div className="dropdownContainer">
                <DropdownMenu onChange={handleDropdownSelect} />
            </div>

            {/* Display the selected option */}
            {selectedOption && (
                <div className="selectedOptionDisplay">
                    <span>You selected: {selectedOption}</span>
                </div>
            )}
            
            <br />
        </div>
    );
};

export default InstructorDashboard