import React, { useEffect, useState } from "react";
import styles from "./MintNFT.module.scss";
import cn from "classnames/bind";
import { Col, Row, Spin } from "antd";
import plusIcon from "src/assets/icons/plus.svg";
import MintNFTBox from "./MintNFTBox";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import web3 from "web3";
import axios from "axios";
import { URL, KAWAII1155_ADDRESS } from "src/consts/constant";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import addNftIcon from "src/assets/icons/add-nft-icon.svg";
import PreviewModal from "./PreviewModal";

const cx = cn.bind(styles);

const MintNFT = ({ setIsMintNFT, gameSelected }) => {
    let oneNft = {
        type: "",
        tokenId: 0,
        author: "",
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

    const { account, library } = useWeb3React();
    const [loading, setLoading] = useState(true);
    const [openMintNFTBox, setOpenMintNFTBox] = useState();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [open, setOpen] = useState(false);
    const [listNft, setListNft] = useState([oneNft]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    const setStateForNftData = (key, value, id = openMintNFTBox) => {

        let listNftCopy = [...listNft];
        listNftCopy[id] = { ...listNftCopy[id], [key]: value };

        setListNft(listNftCopy);
    };

	const checkInvalidData = (data) => {
		for (let i = 0; i < data.length; i++) {
			if (!data[i].tokenId || !data[i].name || !data[i].supply || !data[i].imageUrl) {
				return true;
			}
		}

		return false;
	}

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

    const submit = async () => {
        setIsSubmitted(true);
		const checkData = await checkInvalidData(listNft);
        if (checkData) return;

        setLoadingSubmit(true);
        try {
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
                    {/* <Col span={5}>Preview detail</Col> */}
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
                            <Row className={cx("table-row")} key={index}>
                                <Col span={5}>
                                    <input
                                        placeholder="123456"
                                        value={item?.tokenId}
                                        className={cx(
                                            "input",
                                            isSubmitted && (!item.tokenId || isNaN(item.tokenId)) && "invalid",
                                        )}
                                        onChange={e => setStateForNftData("tokenId", e.target.value, index)}
                                    />
                                </Col>
                                <Col span={5}>
                                    <input
                                        placeholder="Name"
                                        value={item?.name}
                                        className={cx("input", isSubmitted && !item.name && "invalid")}
                                        onChange={e => setStateForNftData("name", e.target.value, index)}
                                    />
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
                                </Col>
                                {/* <Col span={5} className={cx("preview")}>
									{item?.preview}
								</Col> */}
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
                        {loadingSubmit ? <Spin /> : "Submit"}
                    </Button>
                </div>
            </div>

            <PreviewModal open={open} onHide={() => setOpen(!open)} listNft={listNft} />
        </div>
    );
};

export default MintNFT;
