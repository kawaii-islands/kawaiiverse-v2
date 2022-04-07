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
import LoadingModal from "src/components/LoadingModal/LoadingModal";

const web3 = new Web3(BSC_rpcUrls);
const cx = cn.bind(styles);

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
    const [loading, setLoading] = useState(true);
    const [openMintNFTBox, setOpenMintNFTBox] = useState();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [open, setOpen] = useState(false);
    const [listNft, setListNft] = useState([oneNft]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [listInvalidToken, setListInvalidToken] = useState({});
    const [checkedTokenId, setCheckedTokenId] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

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
                console.log("itemSupply :>> ", itemSupply);

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

        console.log(listTokenId, listTokenSupply, listTokenAccount);

        if (chainId !== BSC_CHAIN_ID) {
            const error = await createNetworkOrSwitch(library.provider);
            if (error) {
                throw new Error("Please change network to Testnet Binance smart chain.");
            }
        }
        await write(
            "createBatchItem",
            library.provider,
            gameSelected,
            KAWAIIVERSE_NFT1155_ABI,
            [listTokenAccount, listTokenId, listTokenSupply],
            { from: account },
            hash => {
                console.log(hash);
            },
        );
    };

    const submit = async () => {
        setIsSubmitted(true);

        try {
            const checkData = await checkInvalidData(listNft);
            const checkToken = await checkInValidTokenId(listNft);
            console.log("checkToken :>> ", checkToken);
            if (checkData || checkToken) return;

            setLoadingSubmit(true);
            console.log("gameSelected :>> ", gameSelected);
            await createToken(listNft);

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
                setLoadingSubmit(false);
                setIsMintNFT(false);
            }
        } catch (err) {
            console.log(err.response);
        }

        setLoadingSubmit(false);
    };

    return (
        <div className={cx("mint-nft")}>
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
                    {listNft.map((item, index) =>
                        openMintNFTBox === index ? (
                            <MintNFTBox
                                key={index}
                                data={item}
                                setStateForNftData={setStateForNftData}
                                openMintNFTBox={openMintNFTBox}
                                setOpenMintNFTBox={setOpenMintNFTBox}
                                listNft={listNft}
                                setListNft={setListNft}
                            />
                        ) : (
                            <Row
                                className={cx("table-row")}
                                style={{ alignItems: isSubmitted ? "flex-start" : "center" }}
                                key={index}
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
                                            if (isNaN(item.tokenId)) {
                                                return (
                                                    <div style={{ color: "#9e494d" }}>TokenId must be a number!</div>
                                                );
                                            }
                                            if (checkedTokenId && listInvalidToken[index] > 0) {
                                                console.log("listInvalidToken[idx] :>> ", listInvalidToken[index]);
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
                                    <img
                                        src={
                                            item?.imageUrl
                                                ? item?.imageUrl
                                                : `https://images.kawaii.global/kawaii-marketplace-image/items/201003.png`
                                        }
                                        alt="nft-icon"
                                        width={36}
                                        height={36}
                                    />{" "}
                                    &nbsp;
                                    <input
                                        placeholder="https://images..."
                                        value={item?.imageUrl}
                                        className={cx("input", isSubmitted && !item.imageUrl && "invalid")}
                                        onChange={e => setStateForNftData("imageUrl", e.target.value, index)}
                                        style={{ width: "60%" }}
                                    />
                                    {isSubmitted && !item.imageUrl && (
                                        <div style={{ color: "#9e494d" }}>Please enter image url!</div>
                                    )}
                                </Col>
                                <Col span={1} style={{ cursor: "pointer" }}>
                                    <DeleteOutlinedIcon
                                        className={cx("delete-icon")}
                                        onClick={() => {
                                            if (listNft.length > 1) {
                                                let arr = [...listNft];
                                                arr.splice(index, 1);
                                                setListNft(arr);
                                            }
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
                        ),
                    )}

                    <img
                        src={addNftIcon}
                        alt="add-nft-icon"
                        className={cx("add-nft")}
                        onClick={() => {
                            setListNft([...listNft, oneNft]);
                            setOpenMintNFTBox(listNft.length);
                        }}
                    />
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

			<LoadingModal open={loadingSubmit} />

            <PreviewModal open={open} onHide={() => setOpen(!open)} listNft={listNft} />
        </div>
    );
};

export default MintNFT;
