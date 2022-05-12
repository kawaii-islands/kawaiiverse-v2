import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import MainLayout from "src/components/MainLayout";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Col, Row } from "antd";
import FilterStore from "src/components/FilterStore/FilterStore";
import { Button } from "@mui/material";
import { read } from "src/services/web3";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useWeb3React } from "@web3-react/core";
import { FACTORY_ADDRESS } from "src/consts/address";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import { KAWAIIVERSE_STORE_ADDRESS } from "src/consts/address";
import ListNft from "src/components/ListNft/ListNft";
import { toast } from "react-toastify";
import axios from "axios";
import FilterMobile from "src/components/FilterMobile/FilterMobile";
import { useParams } from "react-router-dom";
import { KAWAII1155_ADDRESS } from "src/consts/constant";
import { URL } from "src/consts/constant";
import ListSkeleton from "src/components/ListSkeleton/ListSkeleton";
import { InputAdornment, TextField, Input } from "@mui/material";
import { Menu, Dropdown, Pagination } from "antd";
import { DownOutlined } from "@ant-design/icons";
import filter from "src/assets/icons/filter.svg";
import { Search as SearchIcon } from "@material-ui/icons";

import cancel from "src/assets/icons/cancel.svg";
const cx = cn.bind(styles);

const PAGE_SIZE = 15;
const Profile = () => {
    const { account } = useWeb3React();
    const [loadingListNFT, setLoadingListNFT] = useState(true);
    const [loadingPage, setLoadingPage] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [gameList, setGameList] = useState([]);
    const [gameSelected, setGameSelected] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [listNft, setListNft] = useState([]);
    const [search, setSearch] = useState("");
    const [listSearch, setListSearch] = useState([]);
    // const [gameItemList, setGameItemList] = useState([]);
    const [originalList, setOriginalList] = useState([]);
    const [sort1, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const firstUpdate = useRef(true);
    const handleSearch = e => {
        setSearch(e.target.value);
        let listSearch = listNft.filter(nft => {
            if (nft.name) {
                return (
                    nft?.name.toUpperCase().includes(e.target.value.toUpperCase()) ||
                    nft?.tokenId.toString().includes(e.target.value)
                );
            }
            return false;
        });

        if (e.target.value === "") {
            setListSearch([]);
            return;
        }
        setListSearch([...listSearch]);
    };

    const checkGameIfIsSelected = address => {
        let count = -1;
        gameSelected.map((game, idx) => {
            if (game.gameAddress === address) {
                count = idx;
            }
        });
        return count;
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

    useEffect(() => {
        getGameList();
    }, []);
    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        } else {
            logGameData();
        }
    }, [gameSelected]);
    const itemRender = (current, type, originalElement) => {
        if (type === "prev") {
            return <span style={{ color: "#FFFFFF" }}>Prev</span>;
        }
        if (type === "next") {
            return <span style={{ color: "#FFFFFF" }}>Next</span>;
        }
        return originalElement;
    };

    const getGameItemLength = async gameAddress => {
        let length;
        length = await read("lengthSellNFT1155", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
            gameAddress,
        ]);
        return length;
    };

    const getGameItemData = async (gameAddress, gameIndex) => {
        let gameData;
        gameData = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
            gameAddress,
            gameIndex,
        ]);
        return gameData;
    };

    const mergeArrayData = (dataArray1, dataArray2) => {
        let mergedArray = dataArray1.map((nft1, idx1) => {
            let nft = nft1;
            dataArray2.map((nft2, idx2) => {
                if (Number(nft1.tokenId) === Number(nft2.tokenId)) {
                    nft = { ...nft2, ...nft1 };
                }
            });

            return nft;
        });
        return mergedArray;
    };

    const logGameData = async a => {
        // setLoadingListNFT(true);

        try {
            let game;
            if (gameSelected?.length) {
                game = gameSelected;
            } else {
                game = gameList;
            }
            if (a) {
                game = a;
            }
            const tmpGameArray = Array(game.length).fill(1);
            const gameListData = await Promise.all(
                tmpGameArray.map(async (nftId, idx) => {
                    let gameItemLength = await getGameItemLength(game[idx].gameAddress);
                    const tmpItemArray = Array(Number(gameItemLength)).fill(1);
                    let res = await axios.get(`${URL}/v1/nft/${game[idx].gameAddress}`);
                    if (res.status === 200) {
                        const gameItemData = await Promise.all(
                            tmpItemArray.map(async (nftId, index) => {
                                let gameItem = await getGameItemData(game[idx].gameAddress, index);

                                gameItem.index = index;
                                gameItem.game = game[idx];
                                return gameItem;
                            }),
                        );
                        let mergeArray = mergeArrayData(gameItemData, res.data.data);
                        mergeArray = mergeArray.filter(nft => {
                            return nft.contract && Number(nft?.amount) - Number(nft?.alreadySale) > 0;
                        });
                        return mergeArray;
                    }
                }),
            );
            setOriginalList(gameListData.flat(3));
            setListNft(gameListData.flat(3));
            setLoadingListNFT(false);
            return gameListData.flat(3);
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred!");
        } finally {
            // setLoadingListNFT(false);
        }
    };
    const handleSort = sort => {
        if (sort === sort1) {
            setSort("");
            setListNft(originalList);
            if (search !== "") {
                let listSearch = listNft.filter(nft => {
                    if (nft.name) {
                        return (
                            nft?.name.toUpperCase().includes(search.toUpperCase()) ||
                            nft?.tokenId.toString().includes(search)
                        );
                    }
                    return false;
                });
                setListSearch([...listSearch]);
            }
            return;
        }
        setSort(sort);
        let newList = search !== "" ? [...listSearch] : [...listNft];

        if (sort === "low") {
            newList = newList.sort(function (a, b) {
                return Number(a.price) - Number(b.price);
            });
        }
        if (sort === "high") {
            newList = newList.sort(function (a, b) {
                return Number(b.price) - Number(a.price);
            });
        }
        if (search !== "") {
            setListSearch(newList);
            return;
        }
        setListNft(newList);
    };

    const getGameLength = async () => {
        let length;
        length = await read("lengthListNFT1155", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, []);
        return length;
    };

    const getGameAddress = async gameIndex => {
        let address;
        address = await read("listNFT1155", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [gameIndex]);
        return address;
    };

    const getGameList = async () => {
        setLoadingListNFT(true);
        try {
            setGameList([]);
            const totalGame = await getGameLength();
            const tmpArray = Array.from({ length: totalGame }, (v, i) => i);
            const gameListData = await Promise.all(
                tmpArray.map(async (nftId, index) => {
                    let gameAddress = await getGameAddress(index);
                    let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
                    let res = await axios.get(`${URL}/v1/game/logo?contract=${gameAddress}`);
                    // console.log(gameAddress, gameName)
                    if (res.status === 200 && res.data.data[0]) {
                        return { gameAddress, gameName, logoUrl: res.data.data[0].logoUrl };
                    }
                    return { gameAddress, gameName };
                }),
            );

            logGameData(gameListData);
            setGameList(gameListData);

            return gameListData;
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred!");
        } finally {
            // setLoadingListNFT(false);
        }
    };
    let displayList = listSearch.length > 0 || search !== "" ? listSearch : listNft;

    const menu = (
        <Menu className={cx("menu-dropdown")}>
            <Menu.Item
                key="low-high"
                onClick={() => handleSort("low")}
                className={cx(sort1 === "low" && "menu-dropdown--active")}
            >
                <div>Price: Low to High</div>
            </Menu.Item>
            <Menu.Item
                key="high-low"
                onClick={() => handleSort("high")}
                className={cx(sort1 === "high" && "menu-dropdown--active")}
            >
                <div>Price: High to Low</div>
            </Menu.Item>
        </Menu>
    );
    return loadingPage ? (
        <LoadingPage />
    ) : (
        <MainLayout>
            <div className={cx("profile")}>
                {openFilterModal && (
                    <FilterMobile
                        setOpenFilterModal={setOpenFilterModal}
                        gameList={gameList}
                        setGameSelected={setGameSelected}
                        gameSelected={gameSelected}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                )}
                <div className={cx("row")}>
                    <div className={cx("left")}>
                        <FilterStore
                            gameList={gameList}
                            setGameSelected={setGameSelected}
                            gameSelected={gameSelected}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>

                    <div className={cx("right")}>
                        <div className={cx("right-top")}>
                            <div className={cx("right-top-title")}>{displayList?.length} items</div>

                            <Input
                                disableUnderline
                                placeholder="Search for NFT"
                                value={search}
                                onChange={handleSearch}
                                className={cx("search")}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <SearchIcon className={cx("icon")} />
                                    </InputAdornment>
                                }
                            />
                            <div className={cx("group-button-filter")}>
                                <Dropdown overlay={menu} className={cx("drop-down")} trigger={["click"]}>
                                    <div className={cx("drop-down-label")}>
                                        <span>Sort by</span> <DownOutlined />
                                    </div>
                                </Dropdown>
                            </div>
                        </div>

                        <div className={cx("right-filter")}>
                            {gameSelected.map((game, idx) => (
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

                            {gameSelected.length > 0 && (
                                <div className={cx("filter-clear")} onClick={handleClearFilter}>
                                    CLEAR ALL
                                </div>
                            )}
                        </div>

                        <Row gutter={[20, 20]} className={cx("list")}>
                            {loadingListNFT ? (
                                <ListSkeleton page={"store"} />
                            ) : (
                                <ListNft
                                    loading={loadingListNFT}
                                    gameItemList={displayList
                                        .reverse()
                                        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
                                    place="marketplace"
                                    // gameSelected={address}
                                />
                            )}
                        </Row>
                        {displayList?.length/PAGE_SIZE > 1 && (
                            <div className={cx("pagination")}>
                                <Pagination
                                    pageSize={PAGE_SIZE}
                                    showSizeChanger={false}
                                    current={currentPage}
                                    total={displayList?.length}
                                    onChange={page => setCurrentPage(page)}
                                    itemRender={itemRender}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Profile;
