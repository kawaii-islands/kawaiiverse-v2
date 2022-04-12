import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import styles from "./index.module.scss";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import { KAWAIIVERSE_STORE_ADDRESS } from "src/consts/address";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { useHistory, useParams } from "react-router";
import { read } from "src/services/web3";
import ListNft from "src/components/ListNft/ListNft";
import { Row, Col } from "antd";
import axios from "axios";
import { Empty } from "antd";
import { URL } from "src/consts/constant";
import ListSkeleton from "../../../../components/ListSkeleton/ListSkeleton";
import { InputAdornment, TextField, Input } from "@mui/material";
import { Menu, Dropdown, Pagination } from "antd";
// import searchIcon from "../../assets/icons/search_24px.svg";
import searchIcon from "src/assets/icons/search_24px.svg";
import { DownOutlined } from "@ant-design/icons";
// import filter from "../../assets/icons/filter.svg";
import filter from "src/assets/icons/filter.svg";
import { Search as SearchIcon } from "@material-ui/icons";
const PAGE_SIZE = 15;
const menu = (
    <Menu>
        <Menu.Item key="low-high">
            <div>Price: Low to High</div>
        </Menu.Item>
        <Menu.Item key="high-low">
            <div>Price: High to Low</div>
        </Menu.Item>
    </Menu>
);
const cx = cn.bind(styles);

const ViewItemNFT = ({ isSellNFT }) => {
    const { account } = useWeb3React();
    const [gameList, setGameList] = useState([]);
    const [gameItemList, setGameItemList] = useState([]);
    const [listSearch, setListSearch] = useState([]);
    const [loadingListNFT, setLoadingListNFT] = useState(true);
    const [allItemFromGame, setAllItemFromGame] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    let { address } = useParams();
    useEffect(() => {
        getGameList();
    }, [account,isSellNFT]);

    useEffect(() => {
        getListNft();
    }, [address,isSellNFT]);

    useEffect(() => {
        getNftList();
        // if (gameList.length && allItemFromGame.length) {
        //     console.log("run get nft list")
            
        // } else {
        //     setGameItemList([]);
        // }
    }, [gameList, allItemFromGame]);
    
    const itemRender = (current, type, originalElement) => {
        if (type === "prev") {
            return <span style={{ color: "#FFFFFF" }}>Prev</span>;
        }
        if (type === "next") {
            return <span style={{ color: "#FFFFFF" }}>Next</span>;
        }
        return originalElement;
    };
    const handleSearch = e => {
        setSearch(e.target.value);
        let listSearch = gameItemList.filter(nft => {
            if (nft.name) {
                return nft?.name.toUpperCase().includes(e.target.value.toUpperCase());
            }
            return false;
        });
        if (e.target.value === "") {
            setListSearch([]);
            return;
        }
        setListSearch([...listSearch]);
    };
    const getListNft = async () => {
        try {
            const res = await axios.get(`${URL}/v1/nft/${address}`);
            if (res.status === 200) {
                setAllItemFromGame(res.data.data);
            } else {
                toast.error("Cannot get list Nft");
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };  

    const getGameList = async () => {
        if (account) {

            try {
                const totalGame = await read(
                    "lengthListNFT1155",
                    BSC_CHAIN_ID,
                    KAWAIIVERSE_STORE_ADDRESS,
                    KAWAII_STORE_ABI,
                    [],
                );
                const tmpArray = Array.from({ length: totalGame }, (v, i) => i);
                const gameListData = Promise.all(
                    tmpArray.map(async (nftId, index) => {
                        let gameAddress = await read(
                            "listNFT1155",
                            BSC_CHAIN_ID,
                            KAWAIIVERSE_STORE_ADDRESS,
                            KAWAII_STORE_ABI,
                            [index],
                        );
                        let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
                        return({gameAddress, gameName});

                    }),
                ).then((value) => {
                    setGameList(value);
                });
            } catch (error) {
                console.log(error);
                toast.error(error.message || "An error occurred!");
            }
        }
    };

    const getNftList = () => {
        setLoadingListNFT(true);
        const tmpGameArray = [...Array(address ? 1 : gameList.length).keys()];
        try {

            const gameListData =  Promise.all(
                tmpGameArray.map(async (nftId, idx) => {
                    let gameItemLength = await read(
                        "lengthSellNFT1155",
                        BSC_CHAIN_ID,
                        KAWAIIVERSE_STORE_ADDRESS,
                        KAWAII_STORE_ABI,
                        [address ? address : gameList[idx].gameAddress],
                       
                    );
                    const tmpItemArray = Array.from({ length: gameItemLength }, (v, i) => i);
                    const gameItemData = await Promise.all(
                        tmpItemArray.map(async (nftId, index) => {
                            let gameItem = await read(
                                "dataNFT1155s",
                                BSC_CHAIN_ID,
                                KAWAIIVERSE_STORE_ADDRESS,
                                KAWAII_STORE_ABI,
                                [address ? address : gameList[idx].gameAddress, index],
                               
                            );
                            let itemInfo = getItemInfo(gameItem.tokenId);
                            return(Object.assign({}, gameItem, itemInfo[0]));
                        }),
                    ).then(value => {
                        let myNftList = [];
                        if (value?.length) {
                            myNftList = value.filter(nft => nft.owner === account);
                        }
                        setLoadingListNFT(false);
                        setGameItemList(myNftList.reverse());
                        
                    })
                    
                }),
            );
        } catch (error) {
            setLoadingListNFT(false);
            console.log(error);
            toast.error(error.message || "An error occurred!");
        }
        
        
    };

    const getItemInfo = tokenId => {
        return allItemFromGame.filter(item => Number(item.tokenId) === Number(tokenId));
    };
    const displayList = (listSearch.length > 0 || search !== "") ? listSearch : gameItemList;
   
    return (
        <div className={cx("right-main")}>
            <div className={cx("right-top")}>
                <div className={cx("right-top-title")}>{displayList?.length} items</div>
                <div className={cx("group-search")}>
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
            </div>
            <Row gutter={[20, 20]} className={cx("list")}>
                {loadingListNFT ? (
                    <ListSkeleton page={"store"} />
                ) : (
                    <ListNft 
                    
                    gameItemList={displayList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)} gameSelected={address} 
                    />
                )}
            </Row>
            {gameItemList?.length > 0 && (
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
    );
};

export default ViewItemNFT;
