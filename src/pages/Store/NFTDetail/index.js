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
import { read, write, sign, createNetworkOrSwitch } from "src/services/web3";
import { useWeb3React } from "@web3-react/core";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Web3 from "web3";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
// import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import logoKawaii from "src/assets/images/logo_kawaii.png";
import BuyNftModal from "./BuyNftModal";
import defaultImage from "src/assets/icons/default_image.svg";

const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const NFTDetail = () => {
    const history = useHistory();

    const { account, library, chainId } = useWeb3React();
    const { storeAddress, tokenId, index } = useParams();
    const [nftInfo, setNftInfo] = useState();
    const [loading, setLoading] = useState(true);
    // const { account } = useWeb3React();
    const { pathname } = useLocation();
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState("");
    const [stepLoading, setStepLoading] = useState(0);
    const [hash, setHash] = useState();
    const [loadingModal, setLoadingModal] = useState(false);
    const [amountBuy, setAmountBuy] = useState(0);
    const [openBuyNftModal, setOpenBuyNftModal] = useState(false);

    useEffect(() => {
        getNftInfo();
    }, [useParams, account]);
    let pathnames = pathname.split("/").filter(Boolean);
    pathnames.splice(5, 1);
    pathnames.splice(2, 1);
    pathnames.splice(1, 4);
    const getNftInfo = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${URL}/v1/nft/${storeAddress.toLowerCase()}/${tokenId}`);
            let gameItem = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
                storeAddress,
                index,
            ]);
            if (res.status === 200) {
                gameItem = { ...gameItem, ...res.data.data };
            }
            gameItem.index = index;
            setNftInfo(gameItem);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getAllowance = async () => {
        if (!account) return;
        const allowance = await read("allowance", BSC_CHAIN_ID, KAWAII_TOKEN_ADDRESS, KAWAII_TOKEN_ABI, [
            account,
            KAWAIIVERSE_STORE_ADDRESS,
        ]);
        console.log("allowance :>> ", typeof allowance);
        return allowance;
        // setIsApprovedForAll(isApprovedForAll);
    };

    const approve = async () => {
        console.log("account :>> ", account);
        return await write(
            "approve",
            library.provider,
            KAWAII_TOKEN_ADDRESS,
            KAWAII_TOKEN_ABI,
            [KAWAIIVERSE_STORE_ADDRESS, Web3.utils.toWei("9999999999", "ether")],
            { from: account },
        );
    };

    const buyNft = async () => {
        let amount = Number(nftInfo?.amount) - Number(nftInfo?.alreadySale);
        if (!account) {
            toast.error("Connect wallet first !");
            return;
        }

        if (amount === 0) {
            toast.error("Sold out!");
            return;
        }

        if (amount < amountBuy || amountBuy < 1) {
            toast.error("Invalid number");
            return;
        }

		setOpenBuyNftModal(false);

        try {
            if (chainId !== BSC_CHAIN_ID) {
                const error = await createNetworkOrSwitch(library.provider);
                if (error) {
                    toast.error(error);
                    throw new Error("Please change network to Testnet Binance smart chain.");
                }
            }
            setShowModalLoading(true);
            setStepLoading(0);
            setLoadingModal(true);
            const allowance = await getAllowance();
            if (allowance < web3.utils.fromWei(nftInfo?.price) * parseInt(amountBuy)) {
                await approve();
            }

            await write(
                "buyNFT1155",
                library.provider,
                KAWAIIVERSE_STORE_ADDRESS,
                KAWAII_STORE_ABI,
                [storeAddress, index, amountBuy],
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
            toast.error(err);
            setStepLoading(3);
        } finally {
            getNftInfo();
            setLoadingModal(false);
        }
    };

    return loading ? (
        <LoadingPage />
    ) : (
        <MainLayout>
            <div className={cx("mint-nft-detail")}>
                {showModalLoading && (
                    <LoadingModal
                        show={showModalLoading}
                        network={"BscScan"}
                        loading={loadingModal}
                        title={loadingTitle}
                        stepLoading={stepLoading}
                        onHide={() => {
                            setShowModalLoading(false);
                            setHash(undefined);
                            setStepLoading(0);
                        }}
                        hash={hash}
                        hideParent={() => {}}
                        notViewNft={true}
                    />
                )}
                {/* <div className={cx("breadcrums")}>
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
                </div> */}
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
                            <img src={nftInfo?.imageUrl || defaultImage} alt="icon" />
                        </div>
                    </Col>

                    <Col offset={1} span={13} className={cx("right")}>
                        <div className={cx("top")}>
                            <div className={cx("title")}>
                                <span className={cx("first")}>{nftInfo?.name}</span>
                                <span className={cx("second")}>#{nftInfo?.tokenId}</span>
                            </div>
                            <Button className={cx("buy-btn")} onClick={() => setOpenBuyNftModal(true)}>
                                Buy NFT
                            </Button>
                        </div>

                        <BuyNftModal
                            open={openBuyNftModal}
                            onHide={() => setOpenBuyNftModal(false)}
                            nftInfo={nftInfo}
                            amountBuy={amountBuy}
                            setAmountBuy={setAmountBuy}
                            buyNft={buyNft}
                        />

                        <div className={cx("category")}>{nftInfo?.category}</div>
                        <div className={cx("content")}>
                            <div style={{ width: "70%" }}>
                                <span className={cx("title")}>Available:</span>
                                <span className={cx("value")}>
                                    {Number(nftInfo?.amount) - Number(nftInfo?.alreadySale)}
                                </span>
                            </div>
                            {/* <div>
                                <span className={cx("title")}>Amount:</span>
                                <input
                                    placeholder="0"
                                    type="number"
                                    min={0}
                                    style={{
                                        background: "#FAF0FF",
                                        borderRadius: "4px",
                                        padding: "8px",
                                        width: "80px",
                                        border: "none",
                                    }}
                                    onChange={e => setAmountBuy(e.target.value)}
                                    className={cx("price-input")}
                                    pattern="^[1-9][0-9]*$"
                                />
                            </div> */}
                        </div>
                        <div className={cx("content")}>
                            <div style={{ width: "70%" }}>
                                <span className={cx("title")}>Price/NFT:</span>
                                <span className={cx("value")}>{web3.utils.fromWei(nftInfo?.price)} KWT</span>
                            </div>
                            {/* <div>
                                <span className={cx("title")}>Total Price:</span>
                                <span className={cx("value")}>
                                    {console.log("nftInfo.price :>> ", nftInfo.price)}
                                    {parseInt(amountBuy)
                                        ? web3.utils.fromWei(nftInfo?.price) * parseInt(amountBuy)
                                        : 0}{" "}
                                    KWT
                                </span>
                            </div> */}
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
                            {nftInfo.attributes?.length > 0 && (
                                <div className={cx("list-attribute")}>
                                    {nftInfo.attributes?.map((info, ind) => (
                                        <div className={cx("one-attribute")} key={`attribute-${ind}`}>
                                            <div className={cx("info-image")}>
                                                <img src={info?.image || defaultImage} alt="attr" />
                                            </div>
                                            <div className={cx("info-attribute")}>
                                                <div className={cx("info-header")}>{info?.type}</div>
                                                <div className={cx("info-text")}>{info?.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default NFTDetail;
