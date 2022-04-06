import React, { useEffect, useState } from "react";
import styles from "./CreateGame.module.scss";
import Grid from "@mui/material/Grid";
import cn from "classnames/bind";
import { BSC_rpcUrls } from "src/consts/blockchain";
import logoKawaii from "../../../assets/images/logo_kawaii.png";
import logoTrend from "../../../assets/images/trend1.png";
import logoLayers from "../../../assets/images/layers1.png";
import logoCreate from "../../../assets/images/add.png";
import addImage from "../../../assets/images/add-img.png";
import logoSuccess from "../../../assets/images/success.png";
import Web3 from "web3";
import { useHistory } from "react-router";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
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
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { Spin } from "antd";

const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);
const KAWAII1155_ADDRESS = "0xD6eb653866F629e372151f6b5a12762D16E192f5";
const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateGame = () => {
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [gameInfo, setgameInfo] = useState({});
    const [errorName, setErrorName] = useState(false);
    const [errorSymbol, setErrorSymbol] = useState(false);
    const [errorImage, setErrorImage] = useState(false);
    const [fileName, setFileName] = useState();
    const [fileSize, setFileSize] = useState();
    const [gameSelected, setGameSelected] = useState(KAWAII1155_ADDRESS);
    const [gameList, setGameList] = useState([]);
    const [loadingGameList, setLoadingGameList] = useState(false);
    const [uploadImageLoading, setUploadImageLoading] = useState(false);
    const [uploadGameLoading, setUploadGameLoading] = useState(false);
    const { account, chainId, library } = useWeb3React();

    useEffect(() => {
        logInfo();
    }, [account]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSuccess(false);
    };
    const history = useHistory();
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
                let gameUrl = res.data.data[0] ? res.data.data[0].logoUrl : "";
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
        e.target.value ? setErrorName(false) : setErrorName(true);
        inputChangeHandler("name", e.target.value);
    };

    const handleChangeSymbol = e => {
        e.target.value ? setErrorSymbol(false) : setErrorSymbol(true);
        inputChangeHandler("symbol", e.target.value);
    };

    const handleUploadImage = async e => {
        setUploadImageLoading(true);

        e.target.files[0] ? setErrorImage(false) : setErrorImage(true);
        const imageSize = Math.round(e.target.files[0].size / 1024);
        imageSize < 5000 ? setErrorImage(false) : setErrorImage(true);

        if (!e.target.files[0]) return;

        const file = e.target.files[0];
        setFileName(e.target.files[0].name);
        setFileSize(imageSize);

        if (imageSize >= 5000) {
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
                    const error = await createNetworkOrSwitch(library.provider);
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
                if (res.status === 200) {
                    console.log(res);
                }
                logInfo();
                setSuccess(true);
                setgameInfo({});
                setFileName();
                setFileSize();
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } catch (err) {
                setSuccess(false);
                console.log(err.response);
            } finally {
                setUploadGameLoading(false);
            }
        } else {
            setUploadGameLoading(false);
        }
    };

    const checkValidation = () => {
        !gameInfo.name ? setErrorName(true) : setErrorName(false);
        !gameInfo.symbol ? setErrorSymbol(true) : setErrorSymbol(false);
        !gameInfo.avatar || fileSize >= 5000 ? setErrorImage(true) : setErrorImage(false);
        if (!gameInfo.name || !gameInfo.symbol || !gameInfo.avatar || fileSize >= 5000) return 0;
        else return 1;
    };

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

                    {!loadingGameList ? (
                        gameList.map((item, idx) => (
                            <Grid item md={4} sm={6} xs={12} key={idx}>
                                <Card className={cx("item-card", "card")}>
                                    <CardContent>
                                        <Typography className={cx("item-header")}>
                                            <img
                                                src={item.gameUrl != "" ? item.gameUrl : logoKawaii}
                                                alt="logo"
                                                className={cx("game-logo")}
                                            />
                                            {/* Kawaii Islands */}
                                            {item.gameName}
                                        </Typography>
                                        <Typography className={cx("item-paragraph")}>
                                            <img src={logoLayers} alt="logo" className={cx("game-mini")} />
                                            Items: <span className={cx("game-amount")}>100</span>
                                        </Typography>
                                        <Typography className={cx("item-paragraph")}>
                                            <img src={logoTrend} alt="logo" className={cx("game-mini")} />
                                            Total sale: <span className={cx("game-amount")}>1,000,000 KWT</span>
                                        </Typography>
                                    </CardContent>
                                    <CardActions className={cx("create-action")}>
                                        <Button
                                            size="small"
                                            className={cx("create-button")}
                                            onClick={() => history.push(`profile/manage-nft/${gameSelected}`)}
                                        >
                                            Join now
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <>
                            {skeletonArray.map((item, idx) => (
                                <Grid item md={4} sm={6} xs={12} key={idx}>
                                    <SkeletonTheme baseColor="#3D1C6C" highlightColor="#402A7D" duration={2}>
                                        <Skeleton className={cx("skeleton")} />
                                    </SkeletonTheme>
                                </Grid>
                            ))}
                        </>
                    )}
                </Grid>
                <Modal open={open} onClose={handleClose}>
                    <div className={cx("modal-style")}>
                        {success == false ? (
                            <>
                                <Typography className={cx("modal_header")}>CREATE GAME</Typography>
                                <input
                                    placeholder="Name"
                                    className={errorName == false ? cx("input") : cx("input_error")}
                                    required
                                    value={gameInfo.name}
                                    onChange={handleChangeName}
                                />
                                {errorName == true ? (
                                    <div className={cx("error_tag")}>
                                        <p className={cx("error_tag_text")}>Name should not be empty!</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <input
                                    placeholder="Symbol"
                                    className={errorSymbol == false ? cx("input") : cx("input_error")}
                                    required
                                    onChange={handleChangeSymbol}
                                />
                                {errorSymbol == true ? (
                                    <div className={cx("error_tag")}>
                                        <p className={cx("error_tag_text")}>Symbol should not be empty!</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <div className={cx("input_container")}>
                                    <input
                                        placeholder="Avatar"
                                        value={fileName}
                                        className={errorImage == false ? cx("input") : cx("input_error")}
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
                                    {errorImage == true ? (
                                        <div className={cx("error_tag")}>
                                            <p className={cx("error_tag_text")}>
                                                Image should not be empty or larger than 5MB!
                                            </p>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                {!uploadImageLoading && !uploadGameLoading ? (
                                    <Button className={cx("modal_create")} onClick={handleCreate}>
                                        Create now
                                    </Button>
                                ) : (
                                    <Button className={cx("modal_create")}>
                                        <Spin />
                                    </Button>
                                )}
                            </>
                        ) : (
                            <div className={cx("modal_success")}>
                                <img src={logoSuccess} alt="logo" className={cx("success_logo")} />
                                <p className={cx("modal_text")}>SUCCESSFUL</p>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default CreateGame;
