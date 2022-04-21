import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Grid from "@mui/material/Grid";
import cn from "classnames/bind";
import MainLayout from "src/components/MainLayout";
import { Col, Row } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import { URL } from "src/consts/constant";
import axios from "axios";
import { useLocation } from "react-router-dom";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import { toast } from "react-toastify";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import RELAY_ABI from "src/utils/abi/relay.json";
import KAWAIIVERSE_NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { KAWAIIVERSE_STORE_ADDRESS, KAWAII_TOKEN_ADDRESS, RELAY_ADDRESS } from "src/consts/address";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import KAWAII_TOKEN_ABI from "src/utils/abi/KawaiiToken.json";
import { read, write, sign } from "src/services/web3";
import { useWeb3React } from "@web3-react/core";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Web3 from "web3";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
// import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);
const NFTDetail = () => {
    const history = useHistory();
    const { storeAddress, tokenId, index } = useParams();
    const [nftInfo, setNftInfo] = useState();
    const [loading, setLoading] = useState(true);
    // const { account } = useWeb3React();
    const { pathname } = useLocation();
    const { account, library, chainId } = useWeb3React();
    useEffect(() => {
        getNftInfo();
    }, [useParams, account]);
    let pathnames = pathname.split("/").filter(Boolean);
    pathnames.splice(5, 1);
    pathnames.splice(2, 1);
    const getNftInfo = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${URL}/v1/nft/${storeAddress.toLowerCase()}/${tokenId}`);
            let gameItem = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
                storeAddress,
                index,
            ]);
            // console.log(res)
            if (res.status === 200) {
                gameItem = { ...gameItem, ...res.data.data };
            }
            // console.log(allNftSell);
            console.log(gameItem);
            gameItem.index = index;
            // return;
            setNftInfo(gameItem);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const getSignature = async () => {
        try {
            const nonce = await read("nonces", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [account]);
            const name = await read("NAME", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, []);
            const EIP712Domain = [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" },
            ];
            const domain = {
                name,
                version: "1",
                chainId: BSC_CHAIN_ID,
                verifyingContract: KAWAIIVERSE_STORE_ADDRESS,
            };
            const Data = [
                { name: "sender", type: "address" },
                { name: "_nftAddress", type: "address" },
                { name: "nonce", type: "uint256" },
            ];

            const message = {
                sender: account,
                _nftAddress: storeAddress,
                nonce,
            };
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
            // const signature2 = await sign2(account, data, library.provider);
            return signature;
        } catch (err) {
            console.log(err);
        }
    };
    const getAllowance = async () => {
        if (!account) return;
        let allowance;
        allowance = await read("allowance", BSC_CHAIN_ID, KAWAII_TOKEN_ADDRESS, KAWAII_TOKEN_ABI, [
            account,
            KAWAIIVERSE_STORE_ADDRESS,
        ]);
        console.log(allowance);
        return getAllowance;
        // setIsApprovedForAll(isApprovedForAll);
    };
    const approve = async () => {
        return await write(
            "approve",
            library.provider,
            KAWAII_TOKEN_ADDRESS,
            KAWAII_TOKEN_ABI,
            [KAWAIIVERSE_STORE_ADDRESS, Web3.utils.toWei("999999999999999", "ether")],
            { from: account },
        );
    };

    const buyNft = async () => {
        console.log(account);
        if (!account) return;
        try {
            // const allowance = await getAllowance();
            // if (!allowance) {
            //     await approve();
            // }
            // await write(
            //     "buyNFTPermit",
            //     library.provider,
            //     KAWAIIVERSE_STORE_ADDRESS,
            //     KAWAII_STORE_ABI,
            //     [storeAddress, tokenId, 1],
            //     { from: account },
            //     hash => {
            //         console.log(hash);
            //     },
            // );
        } catch (err) {
            console.log(err);
        }
    };
    // buyNft();
    return loading ? (
        <LoadingPage />
    ) : (
        <MainLayout>
            <div className={cx("mint-nft-detail")}>
                <div className={cx("breadcrums")}>
                    {" "}
                    <Breadcrumbs separator={<NavigateNextIcon />} aria-label="breadcrumb">
                        {pathnames.map((name, index) => {
                            if (index === 3) return;
                            let routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                            if (index === 1) {
                                routeTo = routeTo + `/${pathnames[2]}?view=true`;
                            }
                            return (
                                <span
                                    key={name}
                                    onClick={() => {
                                        if (index >= 2) {
                                            return;
                                        }
                                        history.push(routeTo);
                                    }}
                                >
                                    {name}
                                </span>
                            );
                        })}
                    </Breadcrumbs>
                </div>
                <Row>
                    <Col span={10} className={cx("left")}>
                        <Button
                            className={cx("back")}
                            onClick={() =>
                                // history.push({
                                //     pathname: `/profile/manage-nft/${address}`,
                                //     state: { isMintNft: false },
                                // })
                                history.goBack()
                            }
                        >
                            <LeftOutlined />
                        </Button>
                        <div className={cx("image-box")}>
                            <img
                                src={
                                    nftInfo?.imageUrl ||
                                    `https://images.kawaii.global/kawaii-marketplace-image/items/201103.png`
                                }
                                alt="icon"
                            />
                        </div>
                    </Col>

                    <Col offset={1} span={13} className={cx("right")}>
                        <div className={cx("title")}>
                            <span className={cx("first")}>{nftInfo?.name}</span>
                            <span className={cx("second")}>#{nftInfo?.tokenId}</span>
                        </div>
                        <div className={cx("third")}>{nftInfo?.category}</div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Available:</span>
                            <span className={cx("value")}>
                                {Number(nftInfo?.amount) - Number(nftInfo?.alreadySale)}/ {nftInfo?.amount}
                            </span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Price:</span>
                            {/* <span className={cx("value")}>{web3.utils.fromWei(nftInfo?.price)} KWT</span> */}
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Author:</span>
                            <span className={cx("value")}>{nftInfo?.author}</span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Description:</span>
                            <span className={cx("value")}>{nftInfo?.description}</span>
                        </div>
                        <div className={cx("content", "content-attribute")}>
                            <span className={cx("title")}>Attributes:</span>

                            {/* <span className={cx("value")}>{nftInfo?.description}</span> */}
                            <Grid container spacing={2}>
                                {nftInfo.attributes?.map((info, idx) => (
                                    <Grid item container xs={6} key={idx}>
                                        <Grid item xs={4}>
                                            <div className={cx("info-image")}>
                                                <img src={info.image}></img>
                                            </div>
                                        </Grid>
                                        <Grid item xs={8} className={cx("info-group")}>
                                            <div className={cx("info-group-header")}>{info.type}</div>
                                            <div className={cx("info-group-text")}>{info.value}</div>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                        <Button className={cx("buy-btn")} onClick={buyNft}>
                            Buy NFT
                        </Button>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default NFTDetail;
