import React, { useEffect, useState } from "react";
import styles from "./ViewNFT.module.scss";
import cn from "classnames/bind";
import ListSkeleton from "src/components/ListSkeleton/ListSkeleton";
import NFTItem from "src/components/NFTItem/NFTItem";
import { Col, Empty, Pagination, Row } from "antd";
import { useHistory } from "react-router";
import axios from "axios";
import { URL } from "src/consts/constant";
import { Input, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@material-ui/icons";
const cx = cn.bind(styles);

const pageSize = 15;

const ViewNFT = ({ gameSelected }) => {
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [listNftByContract, setListNftByContract] = useState();
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		getListNftByContract();
	}, [gameSelected]);

	const getListNftByContract = async () => {
		setLoading(true);

		try {
			const res = await axios.get(`${URL}/v1/nft/${gameSelected}`);

			if (res.status === 200) {
				setListNftByContract(res.data.data);
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const itemRender = (current, type, originalElement) => {
		if (type === "prev") {
			return <span style={{ color: "#FFFFFF" }}>Prev</span>;
		}
		if (type === "next") {
			return <span style={{ color: "#FFFFFF" }}>Next</span>;
		}
		return originalElement;
	};

	return (
		<div className={cx("view-nft")}>
			<div className={cx("top")}>
				<div className={cx("title")}>{listNftByContract?.length} Items</div>
				<div className={cx("group-search")}>
					<Input
						disableUnderline
						placeholder="Search for NFT"
						className={cx("search")}
						endAdornment={
							<InputAdornment position="end">
								<SearchIcon className={cx("icon")} />
							</InputAdornment>
						}
					/>
				</div>
			</div>

			<Row>
				{loading ? (
					<ListSkeleton />
				) : (
					listNftByContract.length > 0 ?
						listNftByContract.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => (
							<NFTItem
								data={item}
								isStore={false}
								handleNavigation={() => history.push({
									pathname: `/profile/manage-nft/${gameSelected}/${item.tokenId}`,
									state: { gameSelected }
								})}
							/>
						)) : (
							<div style={{ margin: '0 auto' }}>
								<Empty />
							</div>
						)
				)}
			</Row>

			{listNftByContract?.length > 0 && (
				<div className={cx("pagination")}>
					<Pagination
						pageSize={pageSize}
						showSizeChanger={false}
						current={currentPage}
						total={listNftByContract?.length}
						onChange={(page) => setCurrentPage(page)}
						itemRender={itemRender}
					/>
				</div>
			)}
		</div>
	);
};

export default ViewNFT;
