import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import profilepic from "../assets/images/profile_image.svg";
import emailpic from "../assets/images/Mail.svg";
// import namepic from "../assets/images/Name.svg";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

import "../styles/signup.scss";
// import MailSvg from "../components/MailSvg";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZiNzE4QzgwYmJlYUQwNTAzYThFMjgzMmI2MDU0RkVmOUU4MzA2NzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE0MTEzNjczNTAsIm5hbWUiOiJUcnkifQ.srPPE7JD3gn8xEBCgQQs_8wyo6rDrXaDWC0QM8FtChA";

const client = new Web3Storage({ token: API_TOKEN });

function Signup() {
  const profile_picture = useRef();
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  // const [fileCid, setFileCid] = useState("");
  const [btnloading, setbtnLoading] = useState(false);
  const [submitNotClicked, setSubmitNotClicked] = useState(true);
  const [uploaded, setUploaded] = useState("Sign Up");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    cid: "",
  });

  async function uploadImage(e) {
    console.log(e.target.value);
    console.log(document.getElementById("input").files[0].name);
    setFileName(document.getElementById("input").files[0].name);
    console.log(URL.createObjectURL(e.target.files[0]));
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  async function handleUpload() {
    var fileInput = document.getElementById("input");
    console.log(fileInput);
    const rootCid = await client.put(fileInput.files, {
      name: "dehitas profile images",
      maxRetries: 3,
    });
    console.log(rootCid);
    const res = await client.get(rootCid);
    const files = await res.files();
    console.log(files);
    const url = URL.createObjectURL(files[0]);
    console.log(url);
    console.log(files[0].cid);
    setUserData({ ...userData, cid: files[0].cid });
    // setFileCid(files[0].cid);
    setUploaded("Redirecting...");
    setbtnLoading(false);
    onSuccess();
    // setFile(url);
  }
  // const resetFile = () => {
  //   setFile("");
  //   setUploaded("Upload File");
  // };
  const onSuccess = () => {
    setTimeout(() => {
      navigate("/");
      // console.log(userData);
    }, 1000);
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <>
      <section className="signup-main">
        <div className="login-card">
          <h2>Sign Up</h2>
          {/* <h3>Enter your details</h3> */}
          <div action="" className="login-form">
            <div className="input-outer-div name-input">
              <img src={emailpic} alt="nameicon" />
              {/* <MailSvg /> */}
              <input
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setUserData({ ...userData, name: e.target.value });
                }}
              />
            </div>
            {/* <PhoneInput
              inputExtraProps={{
                name: "phone",
                required: true,
                autoFocus: false,
              }}
              // country={"us"}
              placeholder="Phone number"
              value={UserData.contact_number}
              autoFocus="false"
              onChange={(e) => setUserData({ ...UserData, contact_number: e })}
            /> */}
            <div className="input-outer-div">
              <img src={emailpic} alt="emailicon" />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => {
                  setUserData({ ...userData, email: e.target.value });
                }}
              />
            </div>
            <div
              className="input-outer-div file-upload-input"
              onClick={(e) => {
                profile_picture.current.click();
              }}
            >
              <img src={profilepic} alt="profileicon" />
              <input
                className="input-edit-profile"
                id="input"
                type="file"
                hidden
                // defaultValue={nameOfUser}
                ref={profile_picture}
                onChange={(e) => {
                  uploadImage(e);
                }}
              />
              <p>{file ? <>{fileName}</> : <>Choose file</>}</p>
            </div>

            {file ? (
              <>
                <div className="file-upload-div">
                  <img src={file} className="uploaded-img" alt="uploadsvg" />
                  <p></p>{" "}
                </div>
              </>
            ) : null}
            {/* <button className="file-upload-btn">Select Profile Image</button> */}

            {file && submitNotClicked ? (
              <>
                <p className="reset-text">
                  * To reset the image, select the file input.
                </p>
              </>
            ) : (
              <>
                <p className="reset-text"></p>
              </>
            )}
            <button
              onClick={() => {
                handleUpload();
                setSubmitNotClicked(false);
                setbtnLoading(true);
              }}
            >
              {btnloading ? (
                <svg
                  className="animate-spin button-spin-svg-pic"
                  version="1.1"
                  id="L9"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 100 100"
                >
                  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"></path>
                </svg>
              ) : (
                <>{uploaded}</>
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;
