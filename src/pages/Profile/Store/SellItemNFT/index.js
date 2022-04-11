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
import addRowItem from "src/assets/icons/addRowItem.svg";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
import { URL } from "src/consts/constant";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useHistory, useParams } from "react-router";
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const SellItemNFT = ({ gameSelected, setIsSellNFT, isSellNFT }) => {
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
    useEffect(() => {
        getListNft();
        getAllowance();
    }, [gameSelected, account, isSellNFT]);

    const getListNft = async () => {
        try {
            const res = await axios.get(`${URL}/v1/nft/${gameSelected}`);
            const gameList = await getGameList();
            const nftSaleList = await getNftList(gameList);
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
                    return nft.supply > 0
                })
                setList([...allList]);
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
        if (listSell?.length === 0) return;
        setSubmitted(true);
        let pass = true;
        listSell.forEach(item => {
            if (!item.price || !item.quantity || Number(item.price) <= 0 || Number(item.quantity) <= 0) pass = false;
        });
        // return;
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

            const { r, s, v } = await getSignature();

            const tokenIds = listSell.map(nft => nft.tokenId);
            const amounts = listSell.map(nft => nft.quantity);
            const prices = listSell.map(nft => web3.utils.toWei(nft.price));

            const _data = web3.eth.abi.encodeFunctionCall(
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "sender",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "_nftAddress",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "_tokenId",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_amount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "_price",
                            type: "uint256",
                        },
                        {
                            internalType: "uint8",
                            name: "v",
                            type: "uint8",
                        },
                        {
                            internalType: "bytes32",
                            name: "r",
                            type: "bytes32",
                        },
                        {
                            internalType: "bytes32",
                            name: "s",
                            type: "bytes32",
                        },
                    ],
                    name: "saleNFT1155",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
                [
                    account,
                    gameSelected,
                    listSell[0].tokenId,
                    listSell[0].quantity,
                    web3.utils.toWei(listSell[0].price),
                    v,
                    r,
                    s,
                ],
            );
            // const _data = web3.eth.abi.encodeFunctionCall(
            //     {
            //         inputs: [
            //             { internalType: "address", name: "sender", type: "address" },
            //             { internalType: "address", name: "_nftAddress", type: "address" },
            //             { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" },
            //             { internalType: "uint256[]", name: "_amounts", type: "uint256[]" },
            //             { internalType: "uint256[]", name: "_prices", type: "uint256[]" },
            //             { internalType: "uint8", name: "v", type: "uint8" },
            //             { internalType: "bytes32", name: "r", type: "bytes32" },
            //             { internalType: "bytes32", name: "s", type: "bytes32" },
            //         ],
            //         name: "saleNFT1155",
            //         outputs: [],
            //         stateMutability: "nonpayable",
            //         type: "function",
            //     },
            //     [
            //         account,
            //         gameSelected,
            //         tokenIds,
            //         amounts,
            //         prices,
            //         v,
            //         r,
            //         s,
            //     ],
            // );

            await write(
                "execute",
                library.provider,
                RELAY_ADDRESS,
                RELAY_ABI,
                [KAWAIIVERSE_STORE_ADDRESS, _data],
                { from: account },
                hash => {
                    console.log(hash);
                    setHash(hash);
                    setStepLoading(1);
                },
            );
            setStepLoading(2);
        } catch (err) {
            console.log(err);
            setStepLoading(3);
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };
    const getSignature = async () => {
        try {
            const nonce = await read("nonces", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [account]);
            // console.log(nonce);
            const name = await read("NAME", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, []);
            // const name = await read("NAME", 97, "0xa1aeb7fdc1068707e635caeff44086c4551e7869", KAWAII_STORE_ABI, []);
            const EIP712Domain = [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" },
            ];
            // console.log("name", name)
            const domain = {
                name,
                version: "1",
                chainId: BSC_CHAIN_ID,
                verifyingContract: KAWAIIVERSE_STORE_ADDRESS,
            };
            // console.log(domain)
            const Data = [
                { name: "sender", type: "address" },
                { name: "_nftAddress", type: "address" },
                { name: "nonce", type: "uint256" },
            ];

            const message = {
                sender: account,
                _nftAddress: gameSelected,
                nonce,
            };
            // console.log(message)
            const data = JSON.stringify({
                types: {
                    EIP712Domain,
                    Data,
                },
                domain,
                primaryType: "Data",
                message,
            });

            const signature = await sign(account, data, library.provider);

            return signature;
        } catch (err) {
            console.log(err);
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

                <Col span={3} style={{ textAlign: "center" }}>
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
                {new Array(rowItem).fill().map((i, idx) => (
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
                    />
                ))}
                {/* <img src={addRowItem} alt="add-icon" className={cx("add-icon")} onClick={addItem} /> */}
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
