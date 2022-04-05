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
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const cx = cn.bind(styles);

const MintNFT = ({ setIsMintNFT, gameSelected }) => {
	const { account, library } = useWeb3React();
	const [loading, setLoading] = useState(true);
	const [openMintNFTBox, setOpenMintNFTBox] = useState(0);
	const [loadingSubmit, setLoadingSubmit] = useState(false);

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

	const [listNft, setListNft] = useState([oneNft]);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1500);
	}, []);

	const setStateForNftData = (key, value) => {
		let listNftCopy = [...listNft];
		listNftCopy[openMintNFTBox] = { ...listNftCopy[openMintNFTBox], [key]: value };

		setListNft(listNftCopy);
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

	const submit = async () => {
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
					{/* <Col span={1} style={{ textAlign: "center" }}>
						No.
					</Col> */}
					<Col span={4}>TokenID <span className={cx("required-icon")}>*</span></Col>
					<Col span={4}>Name <span className={cx("required-icon")}>*</span></Col>
					<Col span={4}>Supply <span className={cx("required-icon")}>*</span></Col>
					<Col span={5}>Image <span className={cx("required-icon")}>*</span></Col>
					<Col span={5}>Preview detail</Col>
					<Col span={1}></Col>
					<Col span={1}></Col>
				</Row>

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
							key={index}
						>
							<Col span={4}>{item?.tokenId}</Col>
							<Col span={4}>{item?.name}</Col>
							<Col span={4}>{item?.supply}</Col>
							<Col span={5}>
								<img
									src={
										item?.imageUrl
											? item?.imageUrl
											: `https://images.kawaii.global/kawaii-marketplace-image/category/${"Icon_Plant_Big"}.png`
									}
									alt="nft-icon"
									width={36}
									height={36}
								/> &nbsp;
								{item?.imageUrl.slice(0, 16)}
							</Col>
							<Col span={5} className={cx("preview")}>
								{item?.preview}
							</Col>
							<Col span={1} style={{ cursor: "pointer" }}>
								<DeleteOutlinedIcon
									className={cx("delete-icon")}
									onClick={() => listNft.length > 1 && setListNft(listNft.slice(0, listNft.length - 1))}
								/>
							</Col>
							<Col span={1} style={{ cursor: "pointer", textAlign: 'right' }}>
								<ExpandMoreIcon
									className={cx("expand-icon")}
									onClick={() => setOpenMintNFTBox(openMintNFTBox === index ? null : index)}
								/>
							</Col>
						</Row>
					),
				)}

				<div className={cx("group-button")}>
					<Button className={cx("submit")} onClick={submit}>
						{loadingSubmit ? <Spin /> : "Submit"}
					</Button>
					<Button
						className={cx("create-nft")}
						onClick={() => {
							setListNft([...listNft, oneNft]);
							setOpenMintNFTBox(listNft.length);
						}}
					>
						<img src={plusIcon} alt="plus-icon" /> &nbsp; Create NFT
					</Button>
				</div>
			</div>
		</div>
	);
};

export default MintNFT;
