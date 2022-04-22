import React, { useEffect, useState } from "react";
import styles from "./NFTDetail.module.scss";
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
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import { KAWAIIVERSE_STORE_ADDRESS } from "src/consts/address";
import { read } from "src/services/web3";
import { useWeb3React } from "@web3-react/core";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import * as web3 from "web3";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import logoKawaii from "src/assets/images/logo_kawaii.png"
const cx = cn.bind(styles);

const NFTDetail = () => {
    const history = useHistory();
    const { nftId, address, tokenId, index } = useParams();
    const [nftInfo, setNftInfo] = useState();
    const [loading, setLoading] = useState(true);
    const { account } = useWeb3React();
    const { pathname } = useLocation();
    useEffect(() => {
        getNftInfo();
    }, [account, address]);
    let pathnames = pathname.split("/").filter(Boolean);
    pathnames.splice(5, 1);
    pathnames.splice(2, 1);
    console.log(pathnames);
    const getNftInfo = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${URL}/v1/nft/${address.toLowerCase()}/${tokenId}`);
            // console.log(nftId);
            // const allNftSell = await getNftList(address);
            // console.log(allNftSell);
            // let nfts = allNftSell.filter(nft => Number(nft.tokenId) === Number(tokenId));
            // console.log(nfts);
            // // let nft = nfts.filter(nft => nft._id === nftId);
            // let nft = nfts[0];
            // nft = { ...nft, ...res.data.data };
            let gameItem = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
                address,
                index,
            ]);
            // console.log(res)
            if (res.status === 200) {
                gameItem = { ...gameItem, ...res.data.data };
            }
            // console.log(allNftSell);
            console.log(gameItem);
            // return;
            setNftInfo(gameItem);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    const getNftList = async address => {
        if (!account) return;
        const tmpGameArray = [...Array(1).keys()];
        try {
            const list = [];
            let myNftList = [];
            const gameListData = await Promise.all(
                tmpGameArray.map(async (nftId, idx) => {
                    let gameItemLength = await read(
                        "lengthSellNFT1155",
                        BSC_CHAIN_ID,
                        KAWAIIVERSE_STORE_ADDRESS,
                        KAWAII_STORE_ABI,
                        [address],
                    );
                    const tmpItemArray = Array.from({ length: gameItemLength }, (v, i) => i);
                    const gameItemData = await Promise.all(
                        tmpItemArray.map(async (nftId, index) => {
                            let gameItem = await read(
                                "dataNFT1155s",
                                BSC_CHAIN_ID,
                                KAWAIIVERSE_STORE_ADDRESS,
                                KAWAII_STORE_ABI,
                                [address, index],
                            );
                            // let itemInfo = getItemInfo(gameItem.tokenId);
                            list.push(Object.assign({}, gameItem));
                            return Object.assign({}, gameItem);
                        }),
                    );
                    // console.log(gameItemData);
                    // let myNftList = [];
                    if (gameItemData?.length) {
                        myNftList = gameItemData.filter(nft => nft.owner === account);
                    }
                }),
            );

            // let myNftList = [];

            return myNftList;
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred!");
        }
    };
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
                                    nftInfo.imageUrl ||
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
                            <span className={cx("title")}>Amount:</span>
                            <span className={cx("value")}>{nftInfo?.amount}</span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Price:</span>
                            <span className={cx("value")}>{web3.utils.fromWei(nftInfo?.price)} KWT</span>
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
                            <div className={cx("list-attribute")}>
                                {nftInfo.attributes[0].type &&  nftInfo.attributes?.map((info, ind) => (
                                    <div className={cx("one-attribute")} key={ind}>
                                        <div className={cx("info-image")}>
                                            <img src={info?.image || logoKawaii} alt="attr" />
                                        </div>
                                        <div className={cx("info-attribute")}>
                                            <div className={cx("info-header")}>{info?.type}</div>
                                            <div className={cx("info-text")}>{info?.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default NFTDetail;
