import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import cn from "classnames/bind";
import styles from "./index.module.scss";
import { Col, Row } from "antd";
import { toast } from "react-toastify";
import Item from "./Item";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { read, sign, write, createNetworkOrSwitch } from "src/services/web3";
import { KAWAIIVERSE_STORE_ADDRESS, RELAY_ADDRESS } from "src/consts/address";
import KAWAIIVERSE_NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import RELAY_ABI from "src/utils/abi/relay.json";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
import "react-toastify/dist/ReactToastify.css";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
import { URL } from "src/consts/constant";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useHistory, useParams } from "react-router";
import { LeftOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const SellItemNFT = ({ gameSelected, setIsSellNFT, isSellNFT }) => {
    const history = useHistory();
    const [list, setList] = useState([]);
    const [listSell, setListSell] = useState([]);
    const [rowItem, setRowItem] = useState(1);
    const [canAdd, setCanAdd] = useState(false);

    const [error, setError] = useState(false);
    const [loadingTx, setLoadingTx] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { address } = useParams();
    const { account, library, chainId } = useWeb3React();
    const [isApprovedForAll, setIsApprovedForAll] = useState(false);
    const [stepLoading, setStepLoading] = useState(0);
    const [hash, setHash] = useState();
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loadingGetList, setLoadingGetList] = useState(true);

    useEffect(() => {
        getListNft();
        getAllowance();
    }, [gameSelected, account, isSellNFT, success]);

    const getListNft = async () => {
        try {
            setLoadingGetList(true);
            const res = await axios.get(`${URL}/v1/nft/${gameSelected.toLowerCase()}`);
            const gameList = await getGameList();
            let nftSaleList = await getNftList(gameList);
            nftSaleList = nftSaleList.filter(nft => {
                return nft.nftAddress === address && nft.owner === account;
            });
            // return;
            if (res.status === 200) {
                let allList = res.data.data;
                for (let i = 0; i < allList.length; i++) {
                    for (let j = 0; j < nftSaleList.length; j++) {
                        if (Number(allList[i].tokenId) === Number(nftSaleList[j].tokenId)) {
                            allList[i].supply = Number(allList[i].supply) - Number(nftSaleList[j].amount);
                        }
                    }
                }
                allList = allList.filter(nft => {
                    return nft.supply > 0;
                });

                // return;
                setList([...allList]);
                setLoadingGetList(false);
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
                const gameListData = await Promise.all(
                    tmpArray.map(async (nftId, index) => {
                        let gameAddress = await read(
                            "listNFT1155",
                            BSC_CHAIN_ID,
                            KAWAIIVERSE_STORE_ADDRESS,
                            KAWAII_STORE_ABI,
                            [index],
                        );
                        let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
                        return { gameAddress, gameName };
                    }),
                );
                // setGameList(gameListData);
                return gameListData;
            } catch (error) {
                console.log(error);
                toast.error(error.message || "An error occurred!");
            }
        }
    };
    const getNftList = async gameList => {
        const tmpGameArray = [...Array(address ? 1 : gameList.length).keys()];
        try {
            const list = [];

            const gameListData = await Promise.all(
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
                            // let itemInfo = getItemInfo(gameItem.tokenId);
                            list.push(Object.assign({}, gameItem));
                            return Object.assign({}, gameItem);
                        }),
                    );
                }),
            );
            let myNftList = [];
            if (list?.length) {
                myNftList = list.filter(nft => nft.owner === account);
            }
            return myNftList;
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred!");
        }
    };

    const getAllowance = async () => {
        if (!account) return;
        const isApprovedForAll = await read("isApprovedForAll", BSC_CHAIN_ID, gameSelected, KAWAIIVERSE_NFT1155_ABI, [
            account,
            KAWAIIVERSE_STORE_ADDRESS,
        ]);
        setIsApprovedForAll(isApprovedForAll);
    };

    const addItem = () => {
        if (!canAdd) return;
        setRowItem(rowItem + 1);
        setCanAdd(false);
    };

    const sellNft = async () => {
        console.log(listSell);
        // return;
        if (listSell?.length === 0) return;
        setSubmitted(true);
        let pass = true;
        listSell.forEach(item => {
            if (!item.price || !item.quantity || Number(item.price) <= 0 || Number(item.quantity) <= 0) pass = false;
        });
        if (!pass) {
            return;
        }
        try {
            if (chainId !== BSC_CHAIN_ID) {
                const error = await createNetworkOrSwitch(library.provider);
                console.log(error);
                if (error) {
                    toast.error(error);
                    throw new Error("Please change network to Testnet Binance smart chain.");
                }
            }
            setLoading(true);
            setStepLoading(0);
            setShowModalLoading(true);
            if (!isApprovedForAll) {
                await write(
                    "setApprovalForAll",
                    library.provider,
                    gameSelected,
                    KAWAIIVERSE_NFT1155_ABI,
                    [KAWAIIVERSE_STORE_ADDRESS, true],
                    {
                        from: account,
                    },
                );
            }

            const tokenIds = listSell.map(nft => nft.tokenId);
            const amounts = listSell.map(nft => nft.quantity);
            const prices = listSell.map(nft => web3.utils.toWei(nft.price));

            await write(
                "saleNFT1155",
                library.provider,
                KAWAIIVERSE_STORE_ADDRESS,
                KAWAII_STORE_ABI,
                [gameSelected, tokenIds, amounts, prices],
                { from: account },
                hash => {
                    console.log(hash);
                    setHash(hash);
                    setStepLoading(1);
                },
            );
            let bodyParams = {
                contract: address,
                amount: Number(listSell[0].quantity),
                tokenId: Number(listSell[0].tokenId),
                price: Number(listSell[0].price),
                supply: Number(listSell[0].supply),
                tokenUnit: "0x6fe3d0f096fc932a905accd1eb1783f6e4cec717",
                owner: account,
                sign: sign,
            };
            console.log(JSON.stringify(bodyParams));

            const res = await axios.post(`${URL}/v1/sale`, bodyParams);
            console.log(res);
            setStepLoading(2);
            setSubmitted(false);
            setListSell([]);
            setRowItem(1);
            setSuccess(true);
        } catch (err) {
            console.log(err);
            setStepLoading(3);
            toast.error(err);
            setSubmitted(false);
        } finally {
            setLoading(false);

            setSubmitted(false);
        }
    };

    return (
        <div className={cx("table")}>
            {showModalLoading && (
                <LoadingModal
                    show={showModalLoading}
                    network={"BscScan"}
                    loading={loading}
                    title={loadingTitle}
                    stepLoading={stepLoading}
                    onHide={() => {
                        setShowModalLoading(false);
                        setHash(undefined);
                        setStepLoading(0);
                    }}
                    hash={hash}
                    hideParent={() => {}}
                    setIsSellNFT={setIsSellNFT}
                />
            )}
            <div className={cx("main-title")}>
                <LeftOutlined
                    onClick={() => {
                        history.push({ search: "?view=true" });
                        setIsSellNFT(false);
                    }}
                />
                SELL NFT
            </div>
            <Row className={cx("table-header")}>
                <Col span={3} style={{ textAlign: "center" }} className={cx("search")}>
                    NFT
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                    Token ID
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                    Name
                </Col>

                <Col span={4} style={{ textAlign: "center" }}>
                    KWT/NFT
                </Col>
                <Col span={5} style={{ textAlign: "center" }}>
                    Quantity
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                    Supply
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                    {/* <input type="checkbox" /> */}
                </Col>
            </Row>
            <div className={cx("table-body")}>
                {loadingGetList ? (
                    <Spin className={cx("spin")} />
                ) : (
                    new Array(rowItem)
                        .fill()
                        .map((i, idx) => (
                            <Item
                                setList={setList}
                                setCanAdd={setCanAdd}
                                setRowItem={setRowItem}
                                rowItem={rowItem}
                                addItem={addItem}
                                submitted={submitted}
                                setSubmitted={setSubmitted}
                                list={list}
                                listSell={listSell}
                                setListSell={setListSell}
                                key={`row-item-${idx}`}
                                index={idx}
                                success={success}
                                setSuccess={setSuccess}
                            />
                        ))
                )}
            </div>
            <div className={cx("wrapper-btn")}>
                <Button
                    className={cx("wrapper-btn--sell", listSell.length && "wrapper-btn--sell--active")}
                    onClick={sellNft}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default SellItemNFT;
