import React, { useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import "../styles/token.scss";
import { parse } from "@ethersproject/transactions";
import SelectNomineeForToken from "./SelectNomineeForToken";

function Tokens() {
  const { address } = useAccount();
  const [showMeticBalance, setMeticBalance] = useState([]);
  const [allTokens, setAllTokens] = useState([]);
  const [showAllToken, setShowAllToken] = useState(false);
  const [showNomineesComponent, setNomineesComponent] = useState(false);

  const [tokenDetails, setTokenDetails] = useState({
    token_address: "",
    token_name: "",
    token_symbol: "",
    token_balance: "",
  });
  const fetchTokens = async () => {
    const options = {
      method: "GET",
      url: "https://deep-index.moralis.io/api/v2/" + address + "/balance",
      params: { chain: "mumbai" },
      headers: {
        accept: "application/json",
        "X-API-Key":
          "sNXC9N5fpBJzWtV0sNHUAOfAyeQDGjfZ01RBZebMLmW2YAOoLgr2ItMow7rVj5Xb",
      },
    };
    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data.balance);
        if (!showMeticBalance.length > 0)
          showMeticBalance.push(response.data.balance);
      })
      .catch(function (error) {
        console.error(error);
      });
    setMeticBalance(showMeticBalance);
    console.log(showMeticBalance);
  };

  const fetchTokenAll = async () => {
    const options = {
      method: "GET",
      url: "https://deep-index.moralis.io/api/v2/" + address + "/erc20",
      params: { chain: "mumbai" },
      headers: {
        accept: "application/json",
        "X-API-Key":
          "sNXC9N5fpBJzWtV0sNHUAOfAyeQDGjfZ01RBZebMLmW2YAOoLgr2ItMow7rVj5Xb",
      },
    };

    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        console.log("inside the all token");
        for (let i = 0; i < response.data.length; i++) {
          if (
            !allTokens.find(
              (temp) =>
                response.data[i]["token_address"] === temp["token_address"]
            )
          ) {
            allTokens.push(response.data[i]);
          }
        }
        setAllTokens(allTokens);
        console.log(allTokens);
        setShowAllToken(true);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchTokens();
    fetchTokenAll();
  }, []);

  return (
    <>
      {showNomineesComponent && (
        <SelectNomineeForToken
          setNomineesComponent={setNomineesComponent}
          tokenDetails={tokenDetails}
        />
      )}
      <div className="token-main">
        <div className="token-table" id="token-table">
          <div className="token-parent">
            {/* <div className="token-header">
            <ul className="token-header-ul">
              <li className="token-header-li">Token</li>
              <li className="token-header-li">Balance</li>
              <li className="token-header-li">Price</li>
              <li className="token-header-li">Nominated</li>
              <li className="token-header-li">Available</li>
            </ul>
          </div> */}
            <table>
              <tr>
                <th>Token</th>
                <th>Balance</th>
                <th>Nominee</th>
              </tr>
              {showMeticBalance && (
                <tr>
                  <td className="token-symbol">MATIC</td>
                  <td>
                    {String(showMeticBalance[0] / Math.pow(10, 18)).substring(
                      0,
                      7
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setNomineesComponent(true);
                        setTokenDetails({
                          ...tokenDetails,
                          token_address:
                            "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
                          token_name: "MATIC",
                          token_symbol: "MATIC",
                          token_balance: Number(
                            String(showMeticBalance[0]).substring(0, 16)
                          ),
                        });
                      }}
                    >
                      Choose Nominee
                    </button>
                  </td>
                </tr>
              )}
              {showAllToken &&
                allTokens.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td className="token-symbol">{val.symbol}</td>
                      <td>
                        {String(val.balance / Math.pow(10, 18)).substring(0, 7)}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setNomineesComponent(true);
                            setTokenDetails({
                              ...tokenDetails,
                              token_address: val.token_address,
                              token_name: val.name,
                              token_symbol: val.symbol,
                              token_balance: Number(
                                String(val.balance).substring(0, 16)
                              ),
                            });
                          }}
                        >
                          Choose Nominee
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </table>
            <div className="token-child"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tokens;
