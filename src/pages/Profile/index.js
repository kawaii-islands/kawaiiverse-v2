import React, { useEffect, useState } from "react";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import MainLayout from "src/components/MainLayout";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Col, Row } from "antd";
import Filter from "src/components/Filter/Filter";
import { Button } from "@mui/material";
import { read } from "src/services/web3";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useWeb3React } from "@web3-react/core";
import { FACTORY_ADDRESS } from "src/consts/address";
import CreateGame from "./CreateGame/CreateGame";
import Game from "./Game/index";
import StoreProfile from "./Store/index";

import FilterMobile from "src/components/FilterMobile/FilterMobile";
import { useParams } from "react-router-dom";
import { KAWAII1155_ADDRESS } from "src/consts/constant";

const cx = cn.bind(styles);

const tabObject = {
	"create-game": 0,
	game: 1,
	store: 2,
};

const Profile = () => {
	const { account } = useWeb3React();
	const [loading, setLoading] = useState(true);
	const [isGameTab, setIsGameTab] = useState(false);
	const [openFilterModal, setOpenFilterModal] = useState(false);
	const [gameList, setGameList] = useState([]);
	const [gameSelected, setGameSelected] = useState(KAWAII1155_ADDRESS);
	const [activeTab, setActiveTab] = useState(1);
	const tabParam = useParams();

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

	const getActiveTab = tab => {
		switch (tab) {
			case 1:
				return <Game gameSelected={gameSelected} />;
			case 2:
				return <StoreProfile gameSelected={gameSelected} />;
			default:
				return (
					<CreateGame
						gameList={gameList}
						setGameSelected={setGameSelected}
						gameSelected={gameSelected}
						logInfo={logInfo}
					/>
				);
		}
	};

	const logInfo = async () => {
		if (account) {
			setGameList([]);
			const list = [];
			try {
				const totalGame = await read("nftOfUserLength", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account]);
				for (let index = 0; index < totalGame; index++) {
					let gameAddress = await read("nftOfUser", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account, index]);
					let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
					// setGameList(gameList => [...gameList, { gameAddress, gameName }]);
					list.push({gameAddress, gameName});
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
				<Row className={cx("row")}>
					<Col md={6} className={cx("left")}>
						<Filter
							setIsGameTab={setIsGameTab}
							gameList={gameList}
							setGameSelected={setGameSelected}
							gameSelected={gameSelected}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>
					</Col>

					<Col offset={1} md={17} className={cx("right-wrapper")}>
						{getActiveTab(activeTab)}
					</Col>
				</Row>
			</div>
		</MainLayout>
	);
};

export default Profile;
