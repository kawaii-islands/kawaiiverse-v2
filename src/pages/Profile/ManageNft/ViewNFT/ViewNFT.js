import React, { useEffect, useState } from "react";
import styles from "./ViewNFT.module.scss";
import cn from "classnames/bind";
import ListSkeleton from "src/components/ListSkeleton/ListSkeleton";
import NFTItem from "src/components/NFTItem/NFTItem";
import { Col, Empty, Pagination, Row } from "antd";
import { useHistory } from "react-router";
import axios from "axios";
import { URL } from "src/consts/constant";
import { Button, Input, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@material-ui/icons";
import ListNft from "src/components/ListNft/ListNft";
const cx = cn.bind(styles);

const pageSize = 15;

const ViewNFT = ({ gameSelected, setIsMintNFT }) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [listNftByContract, setListNftByContract] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [displayList, setDisplayList] = useState();

    useEffect(() => {
        getListNftByContract();
    }, [gameSelected]);

    const getListNftByContract = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${URL}/v1/nft/${gameSelected}`);

            if (res.status === 200) {
                let data = res.data.data.reverse();
                setListNftByContract(data);
                setDisplayList(data);
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

    const handleSearch = e => {
        // let arr = [...listNftByContract];
        // let result = arr.filter((nft, idx) => {
        //     if (nft.name) {
        //         return nft?.name.toUpperCase().includes(e.target.value.toUpperCase());
        //     }
        //     let condition1 = nft?.tokenId.toString().includes(e.target.value);
        //     let condition2 = nft?.name.toUpperCase().includes(e.target.value.toUpperCase());
        //     let condition3 = nft?.author.toUpperCase().includes(e.target.value.toUpperCase());
        //     return condition1 || condition2 || condition3;
        // });
        // console.log("result :>> ", result);
        // setDisplayList([...result]);
    };

    return (
        <div className={cx("view-nft")}>
            <div className={cx("top")}>
                <div className={cx("title")}>{displayList?.length} Items</div>
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
                        onChange={e => handleSearch(e)}
                    />
                    <Button
                        className={cx("button")}
                        onClick={() => {
                            history.push({ search: "?view=false" });
                            setIsMintNFT(true);
                        }}
                    >
                        Mint NFT
                    </Button>
                </div>
            </div>

            <Row>
                {loading ? (
                    <ListSkeleton />
                ) : displayList.length > 0 ? (
                    <div className={cx("list-nft")}>
                        {displayList.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => (
                            <NFTItem
                                key={index}
                                data={item}
                                isStore={false}
                                handleNavigation={() =>
                                    history.push({
                                        pathname: `/profile/manage-nft/view-nft/${gameSelected}/${item.tokenId}`,
                                        state: { gameSelected },
                                    })
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ margin: "0 auto" }}>
                        <Empty />
                    </div>
                )}
            </Row>

            {displayList?.length > 0 && (
                <div className={cx("pagination")}>
                    <Pagination
                        pageSize={pageSize}
                        showSizeChanger={false}
                        current={currentPage}
                        total={displayList?.length}
                        onChange={page => setCurrentPage(page)}
                        itemRender={itemRender}
                    />
                </div>
            )}
        </div>
    );
};

export default ViewNFT;
