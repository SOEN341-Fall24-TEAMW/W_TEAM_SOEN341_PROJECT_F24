import React from 'react';
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <span><img src="/concordia-logo.svg" alt="Concordia Logo" className='headerElement'/></span>
            <span><img src="/50th-anniversary.svg" alt="Concordia Celebrating 50th  Anniversary" className='headerElement'/></span>
            <span><img src="/gina-cody-logo.png" alt="Gina Cody Logo" className='headerElement'/></span>
            <span>
            <input type="button" id='createAccount' onClick={ () => navigate('/create-new-account')} value="Create Account" />
            </span>

        </header>
    );
};

export default Header;