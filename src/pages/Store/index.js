import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import { KAWAIIVERSE_STORE_ADDRESS } from "src/consts/address";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { Search as SearchIcon } from "@material-ui/icons";
import { Menu, Dropdown, Row, Col, Pagination } from "antd";
import { useHistory } from "react-router";
import { read } from "src/services/web3";
import { DownOutlined } from "@ant-design/icons";

import { InputAdornment, TextField, Input } from "@mui/material";
import MainLayout from "src/components/MainLayout";
import searchIcon from "../../assets/icons/search_24px.svg";
import NFTItem from "../../components/NFTItem/NFTItem";
import filter from "../../assets/icons/filter.svg";
import cancel from "../../assets/icons/cancel.svg";
import FilterStore from "src/components/FilterStore/FilterStore";
import FilterMobile from "../../components/FilterMobile/FilterMobile";
import ListSkeleton from "../../components/ListSkeleton/ListSkeleton";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import ListNft from "src/components/ListNft/ListNft";

import styles from "./index.module.scss";

const cx = cn.bind(styles);

const Store = () => {
	const history = useHistory();
	const { account } = useWeb3React();
	const [gameList, setGameList] = useState([]);
	const [gameItemList, setGameItemList] = useState([]);
	const [openFilterModal, setOpenFilterModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadingListNFT, setLoadingListNFT] = useState(true);
	const [totalGameAmount, setTotalGameAmount] = useState(0);
	const [gameSelected, setGameSelected] = useState([]);


	useEffect(() => {
		logInfo();

	}, [totalGameAmount, account]);

	useEffect(() => {
		logGameData();
	}, [gameSelected, gameList]);

	const logInfo = async () => {
		if (account) {
			let lists = [];
			try {
				const totalGame = await read(
					"lengthListNFT1155",
					BSC_CHAIN_ID,
					KAWAIIVERSE_STORE_ADDRESS,
					KAWAII_STORE_ABI,
					[],
				);
				setGameList([]);
				// const tmpArray = [...Array(totalGame.length).keys()];
				const tmpArray = Array.from({ length: totalGame }, (v, i) => i);

				try {

					const gameListData = Promise.all(
						tmpArray.map(async (nftId, index) => {
							let gameAddress = await read("listNFT1155", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
								index,
							]);
							let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
							lists.push({ gameAddress, gameName })
						}),
					).then(() => {
						console.log(lists.length)

						setGameList(lists);
						setTotalGameAmount(lists.length);

					}
					);
				} catch (error) {
					console.log(error);
					toast.error(error.message || "An error occurred!");
				}
			} catch (error) {
				console.log(error);
				toast.error(error.message || "An error occurred!");
			}
		}
		setLoading(false)
	};

	const logGameData = async () => {
		setLoadingListNFT(true);
		setGameItemList([]);
		let list = [];
		const tmpGameArray = [...Array(gameSelected.length ? gameSelected.length : gameList.length).keys()];
		try {

			const gameListData = await Promise.all(
				tmpGameArray.map(async (nftId, idx) => {
					let gameItemLength = await read(
						"lengthSellNFT1155",
						BSC_CHAIN_ID,
						KAWAIIVERSE_STORE_ADDRESS,
						KAWAII_STORE_ABI,
						[gameSelected.length ? gameSelected[idx].gameAddress : gameList[idx].gameAddress],
					);
					const tmpItemArray = Array.from({ length: gameItemLength }, (v, i) => i);


					const gameItemData = await Promise.all(
						tmpItemArray.map(async (nftId, index) => {
							let gameItem = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
								gameSelected.length ? gameSelected[idx].gameAddress : gameList[idx].gameAddress,
								index,
							]);
							list.push(gameItem);
						}),
					).then(() => {
						console.log(list.length)
						setGameItemList(list)
					});

				}),
			);
		} catch (error) {
			console.log(error);
			toast.error(error.message || "An error occurred!");
		}

		const logGameData = async () => {
			setLoadingListNFT(true);
			setGameItemList([]);
			const tmpGameArray = [...Array(gameSelected.length ? gameSelected.length : gameList.length).keys()];
			try {
				const gameListData = Promise.all(
					tmpGameArray.map(async (nftId, idx) => {
						let gameItemLength = await read(
							"lengthSellNFT1155",
							BSC_CHAIN_ID,
							KAWAIIVERSE_STORE_ADDRESS,
							KAWAII_STORE_ABI,
							[gameSelected.length ? gameSelected[idx].gameAddress : gameList[idx].gameAddress],
						);
						const tmpItemArray = [...Array(gameItemLength).keys()];
						try {
							const gameItemData = Promise.all(
								tmpItemArray.map(async (nftId, index) => {
									let gameItem = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
										gameSelected.length ? gameSelected[idx].gameAddress : gameList[idx].gameAddress,
										index,
									]);
									setGameItemList(gameItemList => [...gameItemList, gameItem]);
								}),
							);
						} catch (error) {
							console.log(error);
							toast.error(error.message || "An error occurred!");
						}
					}),
				);
			} catch (error) {
				console.log(error);
				toast.error(error.message || "An error occurred!");
			}

			setLoadingListNFT(false);
		};

		const menu = (
			<Menu>
				<Menu.Item>
					<div>1st menu item</div>
				</Menu.Item>
			</Menu>
		);

		const itemRender = (current, type, originalElement) => {
			if (type === "prev") {
				return <span style={{ color: "#FFFFFF" }}>Prev</span>;
			}
			if (type === "next") {
				return <span style={{ color: "#FFFFFF" }}>Next</span>;
			}
			return originalElement;
		};

		const handleDeleteFilter = address => {
			setGameSelected(gameSelected => {
				const copyGame = [...gameSelected];
				copyGame.splice(checkGameIfIsSelected(address), 1);
				return copyGame;
			});
		};

		const handleClearFilter = () => {
			setGameSelected([]);
		};

		const checkGameIfIsSelected = address => {
			let count = -1;
			gameSelected.map((game, idx) => {
				if (game.gameAddress == address) {
					count = idx;
				}
			});
			return count;
		};

		return loading ? (
			<LoadingPage />
		) : (
			<MainLayout>
				<div className={cx("store")}>
					<div className={cx("left")}>
						<FilterStore
							gameList={gameList}
							setGameSelected={setGameSelected}
							gameSelected={gameSelected}
							checkGameIfIsSelected={checkGameIfIsSelected}
						/>
					</div>
					<div className={cx("right")}>
						<div className={cx("right-top")}>
							<div className={cx("right-top-title")}>{gameItemList.length} items</div>
							<div className={cx("group-search")}>
								<Input
									disableUnderline
									placeholder="Search for NFT"
									className={cx("search")}
									endAdornment={
										<InputAdornment position="end">
											<SearchIcon className={cx("icon")} />
										</InputAdornment>
									}
								/>
								<div className={cx("group-button")}>
									<Dropdown overlay={menu} className={cx("drop-down")}>
										<div className={cx("drop-down-label")}>
											<span>Sort by</span> <DownOutlined />
										</div>
									</Dropdown>
									<div className={cx("button-filter")} onClick={() => setOpenFilterModal(!openFilterModal)}>
										<img src={filter} alt="filter" />
										<span style={{ paddingLeft: "8px" }}>Filter</span>
									</div>
								</div>
							</div>
						</div>

						<div className={cx("right-filter")}>
							{gameSelected?.map((game, idx) => (
								<div className={cx("filter-box")} key={game.gameAddress}>
									<img
										className={cx("filter-box-image")}
										src={cancel}
										alt="cancel"
										onClick={() => handleDeleteFilter(game.gameAddress)}
									/>
									<span style={{ paddingLeft: "5px" }}>{game.gameName}</span>
								</div>
							))}

							<div className={cx("filter-clear")} onClick={handleClearFilter}>
								CLEAR ALL
							</div>
						</div >
						<div className={cx("right-main")}>
							<Row gutter={[20, 20]}>
								{loadingListNFT ? (
									<ListSkeleton />
								) : (
									<ListNft gameItemList={gameItemList} />
								)}
							</Row>
						</div>

						<div className={cx("pagination")}>
							<Pagination
								showSizeChanger={false}
								defaultCurrent={1}
								total={gameItemList.length}
								itemRender={itemRender}
							/>
						</div>
					</div >
					{openFilterModal && <FilterMobile setOpenFilterModal={setOpenFilterModal} />}
				</div >
			</MainLayout >
		);
	};
}

export default Store;
