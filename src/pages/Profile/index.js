import React, { useEffect, useState } from "react";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import MainLayout from "src/components/MainLayout";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import Filter from "src/components/Filter/Filter";
import { read } from "src/services/web3";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useWeb3React } from "@web3-react/core";
import { FACTORY_ADDRESS } from "src/consts/address";
import CreateGame from "./CreateGame/CreateGame";
import Game from "./ManageNft/index";
import StoreProfile from "./Store/index";
import { URL } from "src/consts/constant";
import FilterMobile from "src/components/FilterMobile/FilterMobile";
import { useParams } from "react-router-dom";
import { KAWAII1155_ADDRESS } from "src/consts/constant";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

const cx = cn.bind(styles);

const tabObject = {
    "create-game": 0,
    "manage-nft": 1,
    store: 2,
};

const Profile = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { account } = useWeb3React();
    const [loading, setLoading] = useState(true);
    const [isGameTab, setIsGameTab] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [gameList, setGameList] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const tabParam = useParams();
    const { address } = useParams();
    const [gameSelected, setGameSelected] = useState(address);
    const [gameInfo, setGameInfo] = useState({
        gameName: "",
        gameUrl: "",
    });
    const pathnames = pathname.split("/").filter(Boolean);
    [pathnames[1], pathnames[2]] = [pathnames[2], pathnames[1]];
    pathnames[1] = gameInfo.gameName;
    useEffect(() => {
        setLoading(true);
        if (tabParam.tab) {
            setActiveTab(tabObject[tabParam.tab]);
        }
        setLoading(false);
    }, [tabParam]);

    useEffect(() => {
        logInfo();
    }, [account]);

    useEffect(() => {
        setGameSelected(address);
        getGameInfo();
    }, [address]);

    const getGameInfo = async () => {
        try {
            let gameName = await read("name", BSC_CHAIN_ID, address, NFT1155_ABI, []);
            const res = await axios.get(`${URL}/v1/game/logo?contract=${address}`);
            let gameUrl = "";
            if (res.data.data[0]) {
                gameUrl = res.data.data[0].logoUrl;
            }
            setGameInfo({ gameName, gameUrl });

            console.log("gameName :>> ", gameName);
            console.log("gameUrl :>> ", gameUrl);
        } catch (error) {
            console.log(error);
        }
    };

    const getActiveTab = tab => {
        switch (tab) {
            case 1:
                return <Game gameSelected={gameSelected} />;
            default:
                return <StoreProfile gameSelected={gameSelected} />;
        }
    };

    const logInfo = async () => {
        if (account) {
            setGameList([]);
            const list = [];
            try {
                const totalGame = await read("nftOfUserLength", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account]);
                for (let index = 0; index < totalGame; index++) {
                    let gameAddress = await read("nftOfUser", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [
                        account,
                        index,
                    ]);
                    let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
                    // setGameList(gameList => [...gameList, { gameAddress, gameName }]);
                    list.push({ gameAddress, gameName });
                }
                setGameList(list);
            } catch (err) {
                console.log(err);
            }
        }
    };
    
    
    return loading ? (
        <LoadingPage />
    ) : (
        <MainLayout>
            <div className={cx("profile")}>
                {openFilterModal && (
                    <FilterMobile
                        setOpenFilterModal={setOpenFilterModal}
                        setIsGameTab={setIsGameTab}
                        gameList={gameList}
                        setGameSelected={setGameSelected}
                        gameSelected={gameSelected}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                )}
                <div className={cx("row")}>
                    <div className={cx("left")}>
                        <Filter
                            setIsGameTab={setIsGameTab}
                            gameList={gameList}
                            setGameSelected={setGameSelected}
                            gameSelected={gameSelected}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            gameInfo={gameInfo}
                        />
                    </div>

                    <div className={cx("right")}>
                        <div className={cx("breadcrums")}>
                            {" "}
                           
                            <Breadcrumbs separator={<NavigateNextIcon />} aria-label="breadcrumb">
                                {pathnames.map((name, index) => {
                                    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                                    const isLast = index === pathnames.length - 1;
                                    return isLast ? (
                                        <span key={name}>{name}</span>
                                    ) : (
                                        <span key={name} onClick={() => {if(index === 0){history.push(routeTo)}}}>
                                            {name}
                                        </span>
                                    );
                                })}
                            </Breadcrumbs>
                        </div>
                        {getActiveTab(activeTab)}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Profile;
