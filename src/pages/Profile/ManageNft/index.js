import React, { useEffect, useState } from "react";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import MainLayout from "src/components/MainLayout";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Col, Row } from "antd";
import Filter from "src/components/Filter/Filter";
import { Button } from "@mui/material";
import ViewNFT from "./ViewNFT/ViewNFT";
import MintNFT from "./MintNFT/MintNFT";
import { read } from "src/services/web3";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useWeb3React } from "@web3-react/core";
import { FACTORY_ADDRESS } from "src/consts/address";
import FilterMobile from "src/components/FilterMobile/FilterMobile";
import { useParams } from "react-router-dom";

const cx = cn.bind(styles);

const Game = ({gameSelected}) => {
    const { account } = useWeb3React();
    const [loading, setLoading] = useState(true);
    const [isMintNFT, setIsMintNFT] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    return (
        <div className={cx("profile")}>
            <div className={cx("right")}>
                <div className={cx("group-button")}>
                    <Button
                        className={cx("button", !isMintNFT ? "active" : "text")}
                        onClick={() => setIsMintNFT(false)}
                    >
                        View NFT
                    </Button>
                    <Button className={cx("button", isMintNFT ? "active" : "text")} onClick={() => setIsMintNFT(true)}>
                        Mint NFT
                    </Button>
                </div>
                <div className={cx("content")}>
                    {isMintNFT ? (
                        <div style={{ width: "96%" }}>
                            <MintNFT setIsMintNFT={setIsMintNFT} gameSelected={gameSelected} />
                        </div>
                    ) : (
                        <ViewNFT gameSelected={gameSelected} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game;
