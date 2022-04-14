import React, { useEffect, useState } from "react";
import styles from "./MintNFT.module.scss";
import cn from "classnames/bind";
import { Col, Row, Spin } from "antd";
import plusIcon from "src/assets/icons/plus.svg";
import MintNFTBox from "./MintNFTBox";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import axios from "axios";
import { URL, KAWAII1155_ADDRESS } from "src/consts/constant";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import addNftIcon from "src/assets/icons/add-nft-icon.svg";
import PreviewModal from "./PreviewModal";
import { toast } from "react-toastify";
import { read, createNetworkOrSwitch, write } from "src/services/web3";
import KAWAIIVERSE_NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
import uploadImageIcon from "src/assets/icons/uploadImage.svg";
import { create } from "ipfs-http-client";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Modal } from "react-bootstrap";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import CancelIcon from "@material-ui/icons/Cancel";
import { useHistory } from "react-router-dom";

const web3 = new Web3(BSC_rpcUrls);
const cx = cn.bind(styles);
const client = create("https://ipfs.infura.io:5001/api/v0");

const MintNFT = ({ setIsMintNFT, gameSelected }) => {
    let oneNft = {
        type: "",
        tokenId: 0,
        author: "user",
        name: "",
        description: "",
        mimeType: "",
        imageUrl: "",
        imageThumbnailUrl: "",
        imagePreviewUrl: "",
        tags: [""],
        attributes: [
            {
                type: "",
                value: "",
                image: "",
            },
        ],
        rarity: "",
        supply: 0,
        category: "",
    };

    const { account, chainId, library } = useWeb3React();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [openMintNFTBox, setOpenMintNFTBox] = useState(0);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [open, setOpen] = useState(false);
    const [listNft, setListNft] = useState([oneNft]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [listInvalidToken, setListInvalidToken] = useState({});
    const [checkedTokenId, setCheckedTokenId] = useState(false);
    const [loadingUploadImg, setLoadingUploadImg] = useState(false);
    const [imageIdx, setImageIdx] = useState();
    const [stepLoading, setStepLoading] = useState(0);
    const [loadingTitle, setLoadingTitle] = useState("");
    const [hash, setHash] = useState();
    const listPending = window.localStorage.getItem("listNftPending")
        ? JSON.parse(window.localStorage.getItem("listNftPending"))
        : [];
    const [showPendingModal, setShowPendingModal] = useState(listPending.length);

    useEffect(() => {
        if (listPending.length > 0) {
            console.log("listPending :>> ", listPending);
            setListNft(listPending);
        }
    }, []);

    useEffect(() => {
        if (stepLoading === 3 && listPending.length > 0) {
            setShowPendingModal(true);
        }
    }, [stepLoading]);

    const setStateForNftData = (key, value, id = openMintNFTBox) => {
        if (key === "tokenId") {
            setCheckedTokenId(false);
        }

        let listNftCopy = [...listNft];
        listNftCopy[id] = { ...listNftCopy[id], [key]: value };

        setListNft(listNftCopy);
    };

    const checkInvalidData = data => {
        for (let i = 0; i < data.length; i++) {
            if (!data[i].tokenId || !data[i].name || !data[i].supply || !data[i].imageUrl) {
                return true;
            }
        }

        return false;
    };

    const sign = async (account, data, provider) => {
        let res = await provider.send("eth_signTypedData_v4", [account, data]);
        return res.result;
    };

    const getSignature = async () => {
        let items = JSON.stringify(listNft);
        items = Buffer.from(items, "utf8").toString("hex");
        let hashItems = web3.utils.sha3(items);

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
                name: "nft1155",
                type: "address",
            },
            {
                name: "owner",
                type: "uint256",
            },
            {
                name: "hashData",
                type: "bytes32",
            },
        ];

        const message = {
            nft1155: gameSelected,
            owner: account,
            hashData: hashItems,
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

    const checkInValidTokenId = async data => {
        let list = [];
        let check = false;

        await Promise.all(
            data.map(async (item, ind) => {
                if (isNaN(item.tokenId)) return;

                let itemSupply = await read("getSupplyOfNft", BSC_CHAIN_ID, gameSelected, KAWAIIVERSE_NFT1155_ABI, [
                    item.tokenId,
                ]);

                list[ind] = itemSupply;

                if (itemSupply != 0) {
                    check = true;
                }
                console.log(check);
            }),
        );

        setListInvalidToken(list);
        setCheckedTokenId(true);
        console.log("check", check);
        return check;
    };

    const createToken = async data => {
        let listTokenId = data.map(token => token.tokenId);
        let listTokenSupply = data.map(token => token.supply);
        let listTokenAccount = Array(listTokenId.length).fill(account);

        if (chainId !== BSC_CHAIN_ID) {
            const error = await createNetworkOrSwitch(library.provider);
            if (error) {
                throw new Error("Please change network to Testnet Binance smart chain.");
            }
        }

        setLoading(true);
        setStepLoading(0);

        await write(
            "createBatchItem",
            library.provider,
            gameSelected,
            KAWAIIVERSE_NFT1155_ABI,
            [listTokenAccount, listTokenId, listTokenSupply],
            { from: account },
            hash => {
                console.log(hash);
                setHash(hash);
                setStepLoading(1);
            },
        );
    };

    const handleUploadImage = async (e, index) => {
        setImageIdx(index);
        setLoadingUploadImg(true);

        const file = e.target.files[0];

        try {
            const added = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;

            setStateForNftData("imageUrl", url, index);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }

        setLoadingUploadImg(false);
    };

    const submit = async () => {
        setIsSubmitted(true);

        try {
            if (!listPending.length) {
                const checkData = await checkInvalidData(listNft);
                const checkToken = await checkInValidTokenId(listNft);
                if (checkData || checkToken) return;

                setLoadingSubmit(true);
                await createToken(listNft);

                window.localStorage.setItem("listNftPending", JSON.stringify(listNft));
            }

            setLoadingSubmit(true);
            setStepLoading(null);
            setLoadingTitle("Sign in your wallet!");

            const signature = await getSignature();
            let bodyParams = {
                nft1155: gameSelected,
                owner: account,
                sign: signature,
                data: listNft,
            };

            const res = await axios.post(`${URL}/v1/nft`, bodyParams);
            if (res.status === 200) {
                console.log(res);
                setStepLoading(2);
                window.localStorage.setItem("listNftPending", []);
            }
        } catch (err) {
            console.log(err.response);
            toast.error(err.message || "An error occurred!");

            setStepLoading(3);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx("mint-nft")}>
            <div
                className={cx("back")}
                onClick={() => {
                    history.push({ search: "?view=true" });
                    setIsMintNFT(false);
                }}
            >
                <ArrowBackIosNewRoundedIcon style={{ fontSize: "16px" }} /> &nbsp;
                <span>Mint NFT</span>
            </div>
            <div className={cx("table")}>
                <Row className={cx("table-header")}>
                    <Col span={5}>
                        TokenID <span className={cx("required-icon")}>*</span>
                    </Col>
                    <Col span={5}>
                        Name <span className={cx("required-icon")}>*</span>
                    </Col>
                    <Col span={4}>
                        Supply <span className={cx("required-icon")}>*</span>
                    </Col>
                    <Col span={8}>
                        Image <span className={cx("required-icon")}>*</span>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={1}></Col>
                </Row>

                <div className={cx("table-body")}>
                    {listNft.map((item, index) => (
                        <div className={cx("table-row")} key={`main-${index}`}>
                            <Row
                                className={cx("main-row")}
                                style={{ alignItems: isSubmitted ? "flex-start" : "center" }}
                            >
                                <Col span={5}>
                                    <input
                                        placeholder="123456"
                                        value={item?.tokenId}
                                        className={cx(
                                            "input",
                                            isSubmitted &&
                                                (!item.tokenId ||
                                                    isNaN(item.tokenId) ||
                                                    (listInvalidToken[index] > 0 && checkedTokenId)) &&
                                                "invalid",
                                        )}
                                        onChange={e => setStateForNftData("tokenId", e.target.value, index)}
                                    />
                                    {isSubmitted &&
                                        (() => {
                                            if (!item.tokenId) {
                                                return <div style={{ color: "#9e494d" }}>Please enter tokenId!</div>;
                                            }
                                            if (isNaN(item.tokenId) || item.tokenId < 0) {
                                                return (
                                                    <div style={{ color: "#9e494d" }}>
                                                        TokenId must be a positive number!
                                                    </div>
                                                );
                                            }
                                            if (checkedTokenId && listInvalidToken[index] > 0) {
                                                return <div style={{ color: "#9e494d" }}>TokenId existed!</div>;
                                            }
                                        })()}
                                </Col>
                                <Col span={5}>
                                    <input
                                        placeholder="Name"
                                        value={item?.name}
                                        className={cx("input", isSubmitted && !item.name && "invalid")}
                                        onChange={e => setStateForNftData("name", e.target.value, index)}
                                    />
                                    {isSubmitted && !item.name && (
                                        <div style={{ color: "#9e494d" }}>Please enter token name!</div>
                                    )}
                                </Col>
                                <Col span={4}>
                                    <input
                                        placeholder="100"
                                        value={item?.supply}
                                        className={cx(
                                            "input",
                                            isSubmitted && (!item.supply || isNaN(item.supply)) && "invalid",
                                        )}
                                        onChange={e => setStateForNftData("supply", e.target.value, index)}
                                    />
                                    {isSubmitted && (!item.supply || isNaN(item.supply)) && (
                                        <div style={{ color: "#9e494d" }}>Invalid supply!</div>
                                    )}
                                </Col>
                                <Col span={8}>
                                    <Row style={{ alignItems: "center" }}>
                                        <Col span={4}>
                                            {loadingUploadImg && imageIdx === index ? (
                                                <Spin />
                                            ) : (
                                                <img
                                                    src={
                                                        item?.imageUrl
                                                            ? item?.imageUrl
                                                            : `https://images.kawaii.global/kawaii-marketplace-image/items/201003.png`
                                                    }
                                                    alt="nft-icon"
                                                    width={36}
                                                    height={36}
                                                />
                                            )}
                                        </Col>
                                        <Col span={12}>
                                            <input
                                                placeholder="https://images..."
                                                value={item?.imageUrl}
                                                className={cx("input", isSubmitted && !item.imageUrl && "invalid")}
                                                onChange={e => {
                                                    setImageIdx(index);
                                                    setStateForNftData("imageUrl", e.target.value, index);
                                                }}
                                                style={{ width: "80%" }}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <span>or: </span>
                                            <span className={cx("image-upload")}>
                                                <label htmlFor={`image-${index}`}>
                                                    <img
                                                        src={uploadImageIcon}
                                                        alt="upload-img"
                                                        className={cx("upload-img-icon")}
                                                    />
                                                </label>
                                                <input
                                                    placeholder="String"
                                                    id={`image-${index}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => handleUploadImage(e, index)}
                                                />
                                            </span>
                                        </Col>
                                    </Row>
                                    {isSubmitted && !item.imageUrl && (
                                        <div style={{ color: "#9e494d" }}>Please enter image url!</div>
                                    )}
                                </Col>
                                <Col span={1} style={{ cursor: "pointer" }}>
                                    <DeleteOutlinedIcon
                                        className={cx("delete-icon")}
                                        onClick={() => {
                                            let arr = [...listNft];
                                            arr.splice(index, 1);
                                            setListNft(arr);
                                        }}
                                    />
                                </Col>
                                <Col span={1} style={{ cursor: "pointer", textAlign: "right" }}>
                                    <ExpandMoreIcon
                                        className={cx("expand-icon")}
                                        onClick={() => setOpenMintNFTBox(openMintNFTBox === index ? null : index)}
                                    />
                                </Col>
                            </Row>
                            {openMintNFTBox === index && (
                                <MintNFTBox
                                    data={item}
                                    setStateForNftData={setStateForNftData}
                                    openMintNFTBox={openMintNFTBox}
                                    setOpenMintNFTBox={setOpenMintNFTBox}
                                    listNft={listNft}
                                    setListNft={setListNft}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div
                    className={cx("add-nft")}
                    onClick={() => {
                        setListNft([...listNft, oneNft]);
                        setOpenMintNFTBox(listNft.length);
                    }}
                >
                    <AddCircleOutlineRoundedIcon /> &nbsp;
                    <span>Add NFT</span>
                </div>

                <div className={cx("group-button")}>
                    <Button className={cx("preview")} onClick={() => setOpen(true)}>
                        Preview
                    </Button>
                    <Button className={cx("submit")} onClick={submit}>
                        Submit
                    </Button>
                </div>
            </div>

            {loadingSubmit && (
                <LoadingModal
                    show={loadingSubmit}
                    network={"BscScan"}
                    loading={loading}
                    title={loadingTitle}
                    stepLoading={stepLoading}
                    onHide={() => {
                        setLoadingSubmit(false);
                        setHash(undefined);
                        setStepLoading(0);
                    }}
                    hash={hash}
                    hideParent={() => {}}
                    setIsSellNFT={setIsMintNFT}
                />
            )}

            <Modal
                show={showPendingModal}
                dialogClassName={cx("loading-modal")}
                centered
                onHide={() => setShowPendingModal(true)}
            >
                <Modal.Body className={cx("modal-body")}>
                    {/* <div className={cx("top-body")}>
                        <CancelIcon className={cx("icon-cancel")} onClick={() => setShowPendingModal(false)} />
                    </div> */}
                    <div className={cx("center-body")}>
                        <ListAltRoundedIcon className={cx("icon-list")} />
                    </div>
                    <div className={cx("bottom-body")}>
                        <div className={cx("title")}>Please mint NFTs in pending list!</div>
                        <Button
                            className={cx("MuiButton-root")}
                            size="large"
                            onClick={() => {
                                setShowPendingModal(false);
                                submit();
                            }}
                        >
                            Mint NFTs
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <PreviewModal open={open} onHide={() => setOpen(!open)} listNft={listNft} />
        </div>
    );
};

export default MintNFT;
