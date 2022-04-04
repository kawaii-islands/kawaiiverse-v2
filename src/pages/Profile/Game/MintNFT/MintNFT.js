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
		name: "string",
		description: "",
		mimeType: "",
		imageUrl: "",
		imageThumbnailUrl: "",
		imagePreviewUrl: "http://abc",
		tags: [""],
		attributes: [
			{
				type: "",
				value: "",
				image: "",
			},
		],
		rarity: "string",
		supply: 0,
		category: "string",
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
					<Col span={3} style={{ textAlign: "center" }}>
						NFT
					</Col>
					<Col span={4}>Name</Col>
					<Col span={4}>TokenID</Col>
					<Col span={4}>Supply</Col>
					<Col span={4}>Category</Col>
					<Col span={4}>Preview</Col>
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
							onClick={() => setOpenMintNFTBox(openMintNFTBox === index ? null : index)}
						>
							<Col span={3} style={{ textAlign: "center" }}>
								<img
									src={
										item?.imageUrl
											? item?.imageUrl
											: `https://images.kawaii.global/kawaii-marketplace-image/category/${"Icon_Plant_Big"}.png`
									}
									alt="nft-icon"
									width={36}
									height={36}
								/>
							</Col>
							<Col span={4}>{item?.name}</Col>
							<Col span={4}>{item?.tokenId}</Col>
							<Col span={4}>{item?.supply}</Col>
							<Col span={4}>{item?.category}</Col>
							<Col span={4} className={cx("preview")}>
								{item?.preview}
							</Col>
							<Col span={1} style={{ cursor: "pointer" }}>
								<img src={plusIcon} alt="plus-icon" />
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
