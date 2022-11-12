import React, { useEffect } from "react";

import { useState } from "react";

import "../styles/allnft.scss";
import { Nominees } from "./dummyNominees";
import SelectNominees from "./SelectNominees";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import contract from "../artifacts/Main.json";
export const CONTRACT_ADDRESS = "0x23C82960b09F192A4c6056525829BE57422FaAE9";

function AllNfts({ nftData }) {
  const [indexValue, setIndexValue] = useState();
  console.log(nftData);
  const [showNomineesComponent, setNomineesComponent] = useState(false);
  const [nftData2, setNftData2] = useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const { address, isConnected } = useAccount();

  const temp = async () => {
    // for (let i = 0; i < nftData.length; i++) {
    //   // const nft = JSON.parse(item.metadata);
    //   const nft = JSON.parse(nftData[i].metadata);
    //   console.log(nft);
    //   if (!nftData2.find((temp) => nft["image"] === temp[0]["image"])) {
    //     nftData2.push([nft, nftData[i].token_id, nftData[i].token_address]);
    //   }
    //   // nftData.push([item]);
    // }

    //contract function..........
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const { chainId } = await provider.getNetwork();
        console.log("switch case for this case is: " + chainId);
        if (chainId === 80001) {
          const con = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
          for (let i = 0; i < nftData.length; i++) {
            // const nft = JSON.parse(item.metadata);
            const nft = JSON.parse(nftData[i].metadata);
            const isNominated = await con.checkIsNominated(
              address,
              nftData[i].token_hash
            );
            console.log(i);
            console.log(isNominated);
            // console.log(nft);
            if (!nftData2.find((temp) => nft["image"] === temp[0]["image"])) {
              nftData2.push([
                nft,
                nftData[i].token_id,
                nftData[i].token_address,
                isNominated,
              ]);
            }
            // nftData.push([item]);
          }
          setNftData2(nftData2);
          console.log(nftData2);
          setLoading(false);
        } else {
          alert("Please connect to the mumbai test network!");
        }
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    // nftData.map((item) => {
    //   const nft = JSON.parse(item.metadata);
    //   setNftData2((prev) => [...prev, nft]);
    //   console.log(nftData);
    //   return nftData2;
    // });
  };
  useEffect(() => {
    temp();
  }, [nftData2]);

  // if (nftData.length === 0) {
  //   return (
  //     <>
  //       <div className="all-nft-main">
  //         <div className="nft-image-parent">
  //           <div className="nft-image-child">
  //             <div className="image-div">
  //               <img src="" alt="nftimage" />
  //             </div>
  //             <div className="nft-image-child-inside">
  //               <h3>You don't have any NFTs</h3>
  //               <button className="below-nft-button">Nominated</button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }
  if (!isLoading)
    return (
      <>
        {showNomineesComponent && (
          <SelectNominees
            setNomineesComponent={setNomineesComponent}
            nftData={nftData}
            indexValue={indexValue}
          />
        )}
        <div className="all-nft-main">
          <div className="nft-image-parent">
            {nftData2.map((item, key) => (
              <div className="nft-image-child" key={key}>
                <div className="image-div">
                  <img src={item[0].image} alt="nftimage" />
                </div>
                <div className="nft-image-child-inside">
                  <h3>{item[0].name}</h3>
                  <button
                    className="below-nft-button"
                    onClick={() => {
                      setNomineesComponent(true);
                      setIndexValue({ key });
                      // console.log(temp2.key);
                    }}
                  >
                    {item[3] ? "Nominated" : "Choose Nominee"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  else return <>Loading...</>;
}

export default AllNfts;
