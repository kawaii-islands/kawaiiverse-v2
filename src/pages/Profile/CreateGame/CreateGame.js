import React, { useEffect, useState } from "react";
import styles from "./CreateGame.module.scss";
import Grid from "@mui/material/Grid";
import cn from "classnames/bind";
import { BSC_rpcUrls } from "src/consts/blockchain";
import logoCreate from "../../../assets/images/add.png";
import addImage from "../../../assets/images/add-img.png";
import logoSuccess from "../../../assets/images/success.png";
import logoFailed from "../../../assets/images/error1.png";
import logoLoading from "../../../assets/images/loading1.png";
import Web3 from "web3";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { create } from "ipfs-http-client";
import { useWeb3React } from "@web3-react/core";
import "react-toastify/dist/ReactToastify.css";
import { read, createNetworkOrSwitch, write } from "src/services/web3";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import { RELAY_ADDRESS, FACTORY_ADDRESS, KAWAIIVERSE_NFT1155_ADDRESS } from "src/consts/address";
import { URL } from "src/consts/constant";
import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import RELAY_ABI from "src/utils/abi/relay.json";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Item from "./Item";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { Spin,Pagination } from "antd";
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);
const KAWAII1155_ADDRESS = "0xD6eb653866F629e372151f6b5a12762D16E192f5";
const client = create("https://ipfs.infura.io:5001/api/v0");
const PAGE_SIZE = 8;
const CreateGame = () => {
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [gameInfo, setgameInfo] = useState({});
    const [errorName, setErrorName] = useState(false);
    const [errorSymbol, setErrorSymbol] = useState(false);
    const [errorImage, setErrorImage] = useState(false);
    const [fileName, setFileName] = useState();
    const [fileSize, setFileSize] = useState();
    const [gameList, setGameList] = useState([]);
    const [loadingGameList, setLoadingGameList] = useState(false);
    const [uploadImageLoading, setUploadImageLoading] = useState(false);
    const [uploadGameLoading, setUploadGameLoading] = useState(false);
    const { account, chainId, library } = useWeb3React();
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        logInfo();
    }, [account]);
    const itemRender = (current, type, originalElement) => {
        if (type === "prev") {
            return <span style={{ color: "#FFFFFF" }}>Prev</span>;
        }
        if (type === "next") {
            return <span style={{ color: "#FFFFFF" }}>Next</span>;
        }
        return originalElement;
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSuccess(false);
    };
    const skeletonArray = Array.from(Array(8).keys());

    const logInfo = async () => {
        if (!account) return;
        setGameList([]);
        setLoadingGameList(true);
        try {
            let lists = [];
            const totalGame = await read("nftOfUserLength", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account]);
            for (let index = 0; index < totalGame; index++) {
                let gameAddress = await read("nftOfUser", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account, index]);
                let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
                const res = await axios.get(`${URL}/v1/game/logo?contract=${gameAddress}`);
                let gameUrl = "";
                if (res.data.data[0]) {
                    gameUrl = res.data.data[0].logoUrl;
                }
                lists.push({ gameAddress, gameName, gameUrl });
            }
            setGameList(lists);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingGameList(false);
        }
    };

    const inputChangeHandler = (key, value) => {
        setgameInfo({ ...gameInfo, [key]: value });
    };

    const handleChangeName = e => {
        if (e.target.value) {
            setErrorName(false);
        } else setErrorName(true);
        inputChangeHandler("name", e.target.value);
    };

    const handleChangeSymbol = e => {
        if (e.target.value) {
            setErrorSymbol(false);
        } else setErrorSymbol(true);
        inputChangeHandler("symbol", e.target.value);
    };

    const checkImageSize = size => {
        if (size > 5000) {
            setErrorImage(true);
            return false;
        }
        return true;
    };

    const handleUploadImage = async e => {
        setUploadImageLoading(true);

        if (e.target.files[0]) {
            setErrorImage(false);
        } else {
            setErrorImage(true);
            setUploadImageLoading(false);
            return;
        }

        const imageSize = Math.round(e.target.files[0].size / 1024);
        const file = e.target.files[0];
        setFileName(e.target.files[0].name);
        setFileSize(imageSize);

        if (!checkImageSize(imageSize)) {
            setUploadImageLoading(false);
            return;
        }
        try {
            const added = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            inputChangeHandler("avatar", url);
        } catch (error) {
            console.log("Error uploading file: ", error);
        } finally {
            setUploadImageLoading(false);
        }
    };

    const sign = async (account, data, provider) => {
        let res = await provider.send("eth_signTypedData_v4", [account, data]);
        return res.result;
    };

    const getSignature = async (gameAddress, imageUrl) => {
        const EIP712Domain = [
            {
                name: "domain",
                type: "string",
            },
            {
                name: "version",
                type: "string",
            },
            {
                name: "time",
                type: "uint256",
            },
        ];

        const domain = {
            domain: "http://kawaiiverse.io",
            version: "1",
            time: Date.now(),
        };

        const Data = [
            {
                name: "contract",
                type: "address",
            },
            {
                name: "logoUrl",
                type: "string",
            },
        ];

        const message = {
            contract: gameAddress,
            logoUrl: imageUrl,
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
        return signature;
    };

    const handleCreate = async () => {
        setUploadGameLoading(true);
        if (checkValidation()) {
            const _data = web3.eth.abi.encodeFunctionCall(
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "_owner",
                            type: "address",
                        },
                        {
                            internalType: "address",
                            name: "_imp",
                            type: "address",
                        },
                        {
                            internalType: "string",
                            name: "_name",
                            type: "string",
                        },
                        {
                            internalType: "string",
                            name: "_symbol",
                            type: "string",
                        },
                    ],
                    name: "createNFT1155",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
                [account, KAWAIIVERSE_NFT1155_ADDRESS, gameInfo.name, gameInfo.symbol],
            );

            try {
                if (chainId !== BSC_CHAIN_ID) {
                    console.log(chainId, BSC_CHAIN_ID);
                    const error = await createNetworkOrSwitch(library.provider);
                    console.log(error);
                    if (error) {
                        throw new Error("Please change network to Testnet Binance smart chain.");
                    }
                }
                await write(
                    "execute",
                    library.provider,
                    RELAY_ADDRESS,
                    RELAY_ABI,
                    [FACTORY_ADDRESS, _data],
                    { from: account },
                    hash => {
                        console.log(hash);
                    },
                );

                const totalGame = await read("nftOfUserLength", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account]);
                let gameAddress = await read("nftOfUser", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [
                    account,
                    totalGame - 1,
                ]);
                const signature = await getSignature(gameAddress, gameInfo.avatar);

                let bodyParams = {
                    contract: gameAddress,
                    logoUrl: gameInfo.avatar,
                    sign: signature,
                };

                const res = await axios.post(`${URL}/v1/game/logo`, bodyParams);
                if (res.data.message == "success") {
                    console.log(res);
                    setgameInfo({});
                    setFileName();
                    setFileSize();
                    setUploadGameLoading(false);
                    setSuccess(true);
                    setTimeout(() => {
                        handleClose();
                    }, 4000);
                } else {
                    setUploadGameLoading(false);
                    setFailed(true);
                }
                logInfo();
            } catch (err) {
                setUploadGameLoading(false);
                setFailed(true);
                console.log(err.response);
            }
        } else {
            setUploadGameLoading(false);
        }
    };

    const checkValidation = () => {
        let valid = true;

        if (gameInfo.name) setErrorName(false);
        else {
            setErrorName(true);
            valid = false;
        }

        if (gameInfo.symbol) setErrorSymbol(false);
        else {
            setErrorSymbol(true);
            valid = false;
        }

        if (gameInfo.avatar && fileSize <= 5000) setErrorImage(false);
        else {
            setErrorImage(true);
            valid = false;
        }

        return valid;
    };

    let componentGameList;
    let componentErrorName;
    let componentErrorSymbol;
    let componentErrorImage;
    let componentButtonCreate;
    let componentModal;

    if (loadingGameList) {
        componentGameList = (
            <>
                {skeletonArray.map((item, idx) => (
                    <Grid item md={4} sm={6} xs={12} key={idx}>
                        <SkeletonTheme baseColor="#3D1C6C" highlightColor="#402A7D" duration={2}>
                            <Skeleton className={cx("skeleton")} />
                        </SkeletonTheme>
                    </Grid>
                ))}
            </>
        );
        
    } else {
        componentGameList = gameList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((item, idx) => (
            <Grid item md={4} sm={6} xs={12} key={idx}>
                <Item item={item} />
            </Grid>
        ));
    }

    if (errorName) {
        componentErrorName = (
            <div className={cx("error_tag")}>
                <p className={cx("error_tag_text")}>Name should not be empty!</p>
            </div>
        );
    }

    if (errorSymbol) {
        componentErrorSymbol = (
            <div className={cx("error_tag")}>
                <p className={cx("error_tag_text")}>Symbol should not be empty!</p>
            </div>
        );
    }

    if (errorImage) {
        componentErrorImage = (
            <div className={cx("error_tag")}>
                <p className={cx("error_tag_text")}>Image should not be empty or larger than 5MB!</p>
            </div>
        );
    }

    if (!uploadImageLoading && !uploadGameLoading) {
        componentButtonCreate = (
            <Button className={cx("modal_create")} onClick={handleCreate}>
                Create now
            </Button>
        );
    } else {
        componentButtonCreate = (
            <Button className={cx("modal_create")}>
                <Spin />
            </Button>
        );
    }

    if (uploadGameLoading) {
        componentModal = (
            <div className={cx("modal_success")}>
                <img src={logoLoading} alt="logo" className={cx("loading_logo")} />
                <p className={cx("modal_text")}>LOADING</p>
            </div>
        );
    } else {
        if (success) {
            componentModal = (
                <div className={cx("modal_success")}>
                    <img src={logoSuccess} alt="logo" className={cx("success_logo")} />
                    <p className={cx("modal_text")}>SUCCESSFUL</p>
                </div>
            );
        } else if (failed) {
            componentModal = (
                <div className={cx("modal_failed")}>
                    <img src={logoFailed} alt="logo" className={cx("success_logo")} />
                    <p className={cx("modal_text")}>TRANSACTION FAILED</p>
                </div>
            );
            setTimeout(() => {
                handleClose();
            }, 4000);
        } else {
            componentModal = (
                <>
                    <Typography className={cx("modal_header")}>CREATE GAME</Typography>
                    <input
                        placeholder="Name"
                        className={errorName ? cx("input_error") : cx("input")}
                        required
                        value={gameInfo.name || ""}
                        onChange={handleChangeName}
                    />
                    {componentErrorName}
                    <input
                        placeholder="Symbol"
                        className={errorSymbol ? cx("input_error") : cx("input")}
                        required
                        value={gameInfo.symbol || ""}
                        onChange={handleChangeSymbol}
                    />
                    {componentErrorSymbol}
                    <div className={cx("input_container")}>
                        <input
                            placeholder="Avatar"
                            value={fileName || ""}
                            className={errorImage ? cx("input_error") : cx("input")}
                            readOnly
                        />
                        <label htmlFor="file-input">
                            <img src={addImage} alt="upload-img" className={cx("input_img")} />
                        </label>
                        <input
                            placeholder="String"
                            id="file-input"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={e => handleUploadImage(e)}
                        />
                        {componentErrorImage}
                    </div>

                    {componentButtonCreate}
                </>
            );
        }
    }

    return (
        <div className={cx("container")}>
            <div className={cx("content")}>
                <Grid container spacing={2} className={cx("grid-parent")}>
                    <Grid item md={4} sm={6} xs={12}>
                        <Card className={cx("create-card", "card")} onClick={handleOpen}>
                            <CardContent>
                                <Typography className={cx("create-header")}>
                                    <img src={logoCreate} alt="logo" className={cx("create-logo")} />
                                </Typography>

                                <Typography className={cx("create-paragraph")}>CREATE GAME</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {componentGameList}
                </Grid>
                <div className={cx("pagination")}>
                <Pagination
                        pageSize={PAGE_SIZE}
                        showSizeChanger={false}
                        current={currentPage}
                        total={gameList?.length}
                        onChange={page => setCurrentPage(page)}
                        itemRender={itemRender}
                    />
                    </div>
                <Modal open={open} onClose={handleClose}>
                    <div className={cx("modal-style")}>{componentModal}</div>
                </Modal>
            </div>
        </div>
    );
};

export default CreateGame;
