import React, { useEffect, useState } from 'react';
import styles from './MintNFTBox.module.scss';
import cn from 'classnames/bind';
import { Col, Row, Spin } from 'antd';
import { useHistory } from "react-router";
import subtractIcon from 'src/assets/icons/subtract.svg';
import uploadImageIcon from 'src/assets/icons/uploadImage.svg';
import plusCircleIcon from 'src/assets/icons/plus_circle.svg';
import TableAddAttribute from './TableAddAttribute';
import inforIcon from 'src/assets/icons/InforIcon.svg';
import { Button } from '@mui/material';
import { create } from 'ipfs-http-client';

const cx = cn.bind(styles);

let oneNft = {
	"type": "",
	"tokenId": 0,
	"author": "",
	"name": "",
	"description": "",
	"mimeType": "",
	"imageUrl": "",
	"imageThumbnailUrl": "",
	"imagePreviewUrl": "",
	"tags": [
		""
	],
	"attributes": [
		{
			"type": "",
			"value": "",
			"image": "",
		}
	],
	"rarity": "",
	"supply": 0,
	"category": "",
};

let oneAttribute = {
	"type": "",
	"value": "",
	"image": "",
};

const client = create('https://ipfs.infura.io:5001/api/v0');

const MintNFTBox = ({
	setOpenMintNFTBox,
	setStateForNftData,
	data,
	listNft,
	setListNft,
	openMintNFTBox

}) => {
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [loadingUploadImg, setLoadingUploadImg] = useState(false);
	const [listAttribute, setListAttribute] = useState([data.attributes]);

	useEffect(() => {
		setListAttribute(data.attributes);
		setTimeout(() => {
			setLoading(false);
		}, 1500);
	}, []);

	const setDetailAttribute = (key, value, index) => {
		let listAttributeCopy = [...listAttribute];
		listAttributeCopy[index] = { ...listAttributeCopy[index], [key]: value };
		
		setListAttribute(listAttributeCopy);
	}

	const handleUploadImage = async (e) => {
		setLoadingUploadImg(true);
		const file = e.target.files[0];

		try {
			const added = await client.add(file);
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;

			setStateForNftData("imageUrl", url);
			setLoadingUploadImg(false);
		} catch (error) {
			console.log('Error uploading file: ', error);
		}
	}

	return (
		<div className={cx("mintNFT-box")}>
			<Row className={cx("first-row")}>
				<Col span={3} style={{ textAlign: 'center' }}>
					<input
						value={data.imageUrl}
						placeholder="Image url"
						className={cx("input-1")}
						onChange={(e) => setStateForNftData("imageUrl", e.target.value)}
					/>
				</Col>
				<Col span={4}>
					<input
						placeholder="Name"
						value={data.name}
						className={cx("input")}
						onChange={(e) => setStateForNftData("name", e.target.value)}
					/>
				</Col>
				<Col span={4}>
					<input
						placeholder="Token ID"
						value={data.tokenId}
						className={cx("input")}
						onChange={(e) => setStateForNftData("tokenId", e.target.value)}
					/>
				</Col>
				<Col span={4}>
					<input
						placeholder="Supply"
						value={data.supply}
						className={cx("input")}
						onChange={(e) => setStateForNftData("supply", e.target.value)}
					/>
				</Col>
				<Col span={4}>
					<input
						placeholder="Category"
						value={data.category}
						className={cx("input")}
						onChange={(e) => setStateForNftData("category", e.target.value)}
					/>
				</Col>
				<Col span={4} className={cx("preview")}>
					<input
						placeholder="https://abc"
						value={data.imagePreviewUrl}
						className={cx("input")}
						onChange={(e) => setStateForNftData("imagePreviewUrl", e.target.value)}
					/>
				</Col>
				<Col
					span={1}
					style={{ cursor: 'pointer' }}
					onClick={() => setOpenMintNFTBox(null)}
				>
					<img
						src={subtractIcon}
						alt="plus-icon"
					/>
				</Col>
			</Row>

			<div className={cx("main-box")}>
				<Row className={cx("row")}>
					<Col lg={7} sm={10} md={10} className={cx("one-field")}>
						<div className={cx("title")}>Author: </div>
						<input
							placeholder="String"
							value={data.author}
							className={cx("input")}
							onChange={(e) => setStateForNftData("author", e.target.value)}
						/>
					</Col>
					{/* <Col lg={7} sm={10} md={10} className={cx("one-field")}>
						<div className={cx("title")}>URL: </div>
						<input
							placeholder="String"
							value={data.uri}
							className={cx("input")}
							onChange={(e) => setStateForNftData("uri", e.target.value)}
						/>
					</Col> */}
					<Col lg={7} sm={10} md={10} className={cx("one-field")}>
						<div className={cx("title")}>Rarity: </div>
						<input
							placeholder="String"
							value={data.rarity}
							className={cx("input")}
							onChange={(e) => setStateForNftData("rarity", e.target.value)}
						/>
					</Col>
					<Col lg={7} sm={18} md={10} xs={20} className={cx("one-field", "col-image")}>
						<div className={cx("title")}>Upload image: </div>
						{loadingUploadImg ? <Spin style={{ marginLeft: '10px' }} /> : (
							<input
								value={data.imageUrl}
								placeholder="image url"
								className={cx("input")}
								onChange={(e) => setStateForNftData("imageUrl", e.target.value)}
							/>
						)}
					</Col>
					<Col lg={3} sm={4} md={2} xs={1} className={cx("one-field")}>
						<div className={cx("title")}>or: </div>
						<div className={cx("image-upload")}>
							<label htmlFor="file-input">
								<img src={uploadImageIcon} alt="upload-img" className={cx("upload-img-icon")} />
							</label>
							<input
								placeholder="String"
								id="file-input"
								type="file"
								accept="image/*"
								onChange={(e) => handleUploadImage(e)}
							// onChange={(e) => setStateForNftData("imageUrl", e.target.value.split('\\').pop())}
							/>
						</div>
					</Col>
				</Row>

				<Row className={cx("row", "row-desc")}>
					<Col span={24} className={cx("one-field")} style={{ alignItems: 'baseline' }}>
						<div className={cx("title")}>Description: </div>
						<textarea
							placeholder={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel massa est. Nulla facilisi. Suspendisse euismod enim nec ipsum bibendum, ultricies rutrum nisl tincidunt.`}
							className={cx("input")}
							value={data.description}
							onChange={(e) => setStateForNftData("description", e.target.value)}
							style={{ width: '100%' }}
							rows={2}
						/>
					</Col>
				</Row>

				<Row className={cx("row")}>
					<Col span={24} className={cx("one-field", "table-wrapper")} style={{ alignItems: 'baseline' }}>
						<div className={cx("title")}>
							Attributes: &nbsp;
							<img
								src={plusCircleIcon}
								alt="upload-img"
								style={{ cursor: 'pointer' }}
								onClick={() => setListAttribute([...listAttribute, oneAttribute])}
							/>
						</div>
						<div className={cx("table")}>
							<TableAddAttribute
								listAttribute={listAttribute}
								setListAttribute={setListAttribute}
								setDetailAttribute={setDetailAttribute}
								deleteAttribute={() => setStateForNftData("attributes",
									listAttribute.slice(0, listAttribute.length - 1))
								}
							/>
						</div>
					</Col>
				</Row>
			</div>

			<div className={cx("box-bottom")}>
				<div className={cx("left")}>
					<img src={inforIcon} alt="infor-icon" /> &nbsp;
					<span>You can double click to edit the information</span>
				</div>
				<div className={cx("right")}>
					<Button
						className={cx("confirm")}
						onClick={() => {
							setStateForNftData("attributes", listAttribute);
							setOpenMintNFTBox(null);
						}}
					>Confirm</Button>

					<Button
						className={cx("delete")}
						onClick={() => setListNft(listNft.slice(0, listNft.length - 1))}
					>Delete</Button>
				</div>
			</div>
		</div>
	);
}

export default MintNFTBox;