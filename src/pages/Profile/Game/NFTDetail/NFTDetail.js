import React, { useEffect, useState } from 'react';
import styles from './NFTDetail.module.scss';

import cn from 'classnames/bind';
import MainLayout from 'src/components/MainLayout';
import { Col, Row } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { Button } from '@mui/material';
import { useParams, useHistory } from "react-router-dom";
import { URL } from 'src/consts/constant';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import LoadingPage from 'src/components/LoadingPage/LoadingPage';

const cx = cn.bind(styles);

const NFTDetail = () => {
	const history = useHistory();
	const location = useLocation();
	const { nftId, address } = useParams();
	const [nftInfo, setNftInfo] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getNftInfo();
	}, []);

	const getNftInfo = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL}/v1/nft/${address}/${nftId}`);
			setNftInfo(res.data.data);
			console.log('res :>> ', res);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	return loading ? (
		<LoadingPage />
	) : (
		<MainLayout>
			<div className={cx("mint-nft-detail")}>
				<Row>
					<Col span={10} className={cx("left")}>
						<Button
							className={cx("back")}
							onClick={() => history.push("/profile/game")}
						><LeftOutlined /></Button>
						<div className={cx("image-box")}>
							<img src={nftInfo.imageUrl || `https://images.kawaii.global/kawaii-marketplace-image/items/201103.png`} alt="icon" />
						</div>
					</Col>

					<Col offset={1} span={13} className={cx("right")}>
						<div className={cx("title")}>
							<span className={cx("first")}>{nftInfo?.name}</span>
							<span className={cx("second")}>#{nftInfo?.tokenId}</span>
							<span className={cx("third")}>{nftInfo?.category}</span>
						</div>
						<div className={cx("content")}>
							<span className={cx("title")}>Supply:</span>
							<span className={cx("value")}>{nftInfo?.supply}</span>
						</div>
						<div className={cx("content")}>
							<span className={cx("title")}>Author:</span>
							<span className={cx("value")}>{nftInfo?.author}</span>
						</div>
						<div className={cx("content")}>
							<span className={cx("title")}>Description:</span>
							<span className={cx("value")}>
								{nftInfo?.description}
							</span>
						</div>
					</Col>
				</Row>
			</div>
		</MainLayout>
	)
}

export default NFTDetail;