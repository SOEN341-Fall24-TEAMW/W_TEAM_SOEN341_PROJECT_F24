import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ loggedIn, setLoggedIn}) => {
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <header className="header">
            <span><img src="/concordia-logo.svg" alt="Concordia Logo" id='headerLogo'/></span>
            <span><img src="/50th-anniversary.svg" alt="Concordia Celebrating 50th  Anniversary" id='headerLogo'/></span>
            <span><img src="/gina-cody-logo.png" alt="Gina Cody Logo" id='headerLogo'/></span>
            <span className='header2'>
                {!loggedIn && (
                    <span>
                        <input type="button" id='sessionManagement' onClick={ () => navigate('/create-new-account')} value="Create Account" />
                    </span>
                )}

                {location.pathname !== '/login' && !loggedIn && (
                    <span>
                        <input type="button" id='sessionManagement' value={ "Login" } onClick={ () => {
                            navigate("/login");}
                        } />
                    </span>
                )}
                
                {loggedIn && (
                    <span>
                        <input type="button" id='sessionManagement' value={ "Logout" } onClick={ () => {
                            localStorage.removeItem("user");
                            setLoggedIn(false);
                            navigate("/login");}
                        } />
                    </span>
                )}
            </span>

        </header>
    );
};

export default Header;