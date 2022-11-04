import React from "react";
import "../styles/home.scss";
import bg1 from "../assets/images/background_copy.svg";
import avatar2 from "../assets/images/Avatar_1.svg";
import avatar1 from "../assets/images/Avatar_2.svg";
import avatar3 from "../assets/images/Avatar_3.svg";
import purplecharacter from "../assets/images/purple_character.svg";
import wallet01 from "../assets/images/wallet_1.svg";
import wallet02 from "../assets/images/wallet_2.svg";
import art2 from "../assets/images/Abstract-3d-art-background-1.png";
import art1 from "../assets/images/Abstract-3d-art-background-2.png";
import bitcoin from "../assets/images/Bitcoin.svg";
import neocoin from "../assets/images/neocoin.svg";
import tethercoin from "../assets/images/tether.svg";
// import ecoin from "../assets/images/ethereumcoin.svg";
import item1 from "../assets/images/1.png";
import item2 from "../assets/images/2.png";
import item3 from "../assets/images/3.png";
import arrow from "../assets/images/yellow_arrow.svg";

function Home() {
  return (
    <>
      <section className="home-main">
        {/* <div className="home-navbar">
          <div className="navbar-menu">
            <ul>
              <li className="logo-li">Eternal</li>
              <li>Eternal</li>
            </ul>
          </div>
          <button className="home-connect-btn">Connect Wallet</button>
        </div> */}
        <section className="home-hero">
          <img className="bg-first" src={bg1} alt="background_image" />
          <div className="inside-hero-first">
            <h1 className="home-h1-1">
              Lorem ipsum dolor sit
              <span className="home-h1-2">adipiscing elit</span>
            </h1>
            <p className="home-first-p">
              Lorem ipsum dolor sit amet. Mauris feugiat orci quam, vel mattis
              velit efficitur vel. Ligula in mauris et magna.{" "}
            </p>
            <div className="home-avatar">
              <div className="avatars">
                <img src={avatar1} width="52px" alt="avatar1" />
                <img src={avatar2} width="52px" alt="avatar2" />
                <img src={avatar3} width="52px" alt="avatar3" />
              </div>
              <button className="home-hero-button">Jaydip</button>
            </div>
            {/* <h1>Hello</h1> */}
          </div>
          <div className="inside-hero-second">
            <div className="inside-hero-inside-second">
              <div className="hero-inside-second-img">
                <img src={purplecharacter} alt="character" />
              </div>
              <div>
                <h3>something</h3>
              </div>
              <div className="hero-inside-second-btn-div">
                <button className="hero-inside-second-button-1">Lorem</button>
                <button className="hero-inside-second-button-2">Ipsum</button>
              </div>
            </div>
          </div>
        </section>

        <section className="home-second">
          <img className="abstarct-img-1" src={art1} alt="artimage" />
          <img className="abstarct-img-2" src={art2} alt="artimage" />
          <h1 className="home-h2-1">
            <span className="home-h2-2">Lorem ipsum</span> adipiscing elit
          </h1>
          <div className="inside-second">
            <div className="inside-second-inside-three">
              <img className="wallet-image" src={wallet01} alt="walletimage" />
            </div>
            <div className="inside-second-inside-three">
              <div className="two">
                <img src={bitcoin} alt="" className="bitcoin" />
                <img src={neocoin} alt="" className="neocoin" />
                <img src={tethercoin} alt="" className="tethercoin" />
                <img src={tethercoin} alt="" className="ethereumcoin" />
                <img src={item1} alt="" className="nft-1" />
                <img src={item2} alt="" className="nft-2" />
                <img src={item3} alt="" className="nft-3" />
                <img src={arrow} alt="" className="arrow" />
              </div>
            </div>
            <div className="inside-second-inside-three">
              <img className="wallet-image" src={wallet02} alt="walletimage" />
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Home;
