import React from "react";
import "../styles/home.scss";

function Navbar() {
  return (
    <div className="home-navbar">
      <div className="navbar-menu">
        <ul>
          <li className="logo-li">Eternal</li>
        </ul>
      </div>
      <button className="home-connect-btn">Connect Wallet</button>
    </div>
  );
}

export default Navbar;
