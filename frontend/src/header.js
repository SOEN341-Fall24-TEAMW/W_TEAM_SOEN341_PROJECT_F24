import React from 'react';

export const doNothing = () => {};

const Header = () => {
    return (
        <header className="header">
            <span><img src="/concordia-logo.svg" alt="Concordia Logo" className='headerElement'/></span>
            <span><img src="/50th-anniversary.svg" alt="Concordia Celebrating 50th  Anniversary" className='headerElement'/></span>
            <span><img src="/gina-cody-logo.png" alt="Gina Cody Logo" className='headerElement'/></span>
            <span>
            <input type="button" id='createAccount' onClick={doNothing} value="Create Account" />
            </span>

        </header>
    );
};

export default Header;