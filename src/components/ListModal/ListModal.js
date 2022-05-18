// import { Modal } from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import React, { useState } from "react";
import styles from "./ListModal.module.scss";
import cn from "classnames/bind";
import closeIcon from "src/assets/icons/close-icon.svg";
// import DetailModal from "./DetailModal";
import { Pagination } from "antd";
import { InputAdornment, TextField, Input, Button } from "@mui/material";
import { Search as SearchIcon } from "@material-ui/icons";
import checkIcon from "src/assets/images/success.png";
const cx = cn.bind(styles);

const pageSize = 4;

const ListModal = ({ open, onHide, listNft, title, desc, selectNft }) => {
    const [currentPage, setCurrentPage] = useState(1);
    // const [openDetailModal, setOpenDetailModal] = useState(false);
    // const [selectedNft, setSelectedNft] = useState();
    const [listSelected, setListSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [listSearch, setListSearch] = useState([]);
    const itemRender = (current, type, originalElement) => {
        if (type === "prev") {
            return <span style={{ color: "#402A7D" }}>Prev</span>;
        }
        if (type === "next") {
            return <span style={{ color: "#402A7D" }}>Next</span>;
        }
        return originalElement;
    };
    const handleSearch = e => {
        setSearch(e.target.value);
        let listSearch = listNft.filter(nft => {
            if (nft.name) {
                return (
                    nft?.name.toUpperCase().includes(e.target.value.toUpperCase()) ||
                    nft?.tokenId.toString().includes(e.target.value)
                );
            }
            return false;
        });
        if (e.target.value === "") {
            setListSearch([]);
            return;
        }
        setListSearch([...listSearch]);
    };
    const clickNft = nft => {
        const { tokenId } = nft;
        let list = [...listSelected];
        let isExist = listSelected.find(nft => nft.tokenId === tokenId);
        if (!isExist) {
            list.push(nft);
        } else {
            list = list.filter(nft => nft.tokenId !== tokenId);
        }

        setListSelected(list);
        
    };
    const clickOk = () => {
        selectNft(listSelected);
        setListSelected([]);
    }
    const displayList = listSearch.length || search ? listSearch : listNft;
    return (
        <Modal show={open} onHide={onHide} backdrop="static" centered className={cx("modal")}>
            <Modal.Body className={cx("modal-style")}>
            <div >
                <div className={cx("close-icon")} onClick={onHide}>
                    <img src={closeIcon} alt="close-icon" />
                </div>
                <Input
                    disableUnderline
                    placeholder="Search for NFT"
                    value={search}
                    onChange={handleSearch}
                    className={cx("search")}
                    endAdornment={
                        <InputAdornment position="end">
                            <SearchIcon className={cx("icon")} />
                        </InputAdornment>
                    }
                />
                <div className={cx("title")}>
                    <div className={cx("big-title")}>{title} : {listSelected.length}</div>
                    <div className={cx("sub-title")}>{desc}</div>
                </div>

                <div className={cx("list-nft")}>
                    {displayList.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => {
                        const isExist = listSelected.find(nft => nft.tokenId === item.tokenId);
                        return (
                            <div
                                className={cx("nft-item", isExist && "nft-item-active")}
                                key={index}
                                onClick={() => {
                                    // selectNft(item);
                                    clickNft(item);
                                }}
                            >
                                <div className={cx(isExist ? "check" : "no-check")}>
                                    <img src={checkIcon}/>
                                </div>
                                <div className={cx("top")}>
                                    <img
                                        src={
                                            item?.imageUrl
                                                ? `${item.imageUrl}`
                                                : `https://images.kawaii.global/kawaii-marketplace-image/items/201003.png`
                                        }
                                        alt="preview-img"
                                        className={cx("preview-img")}
                                    />
                                </div>

                                <div className={cx("bottom")}>
                                    <div className={cx("title")}>{item?.name || "Name"}</div>
                                    <div className={cx("nftId")}>#{item?.tokenId}</div>
                                    <div className={cx("nftId")}>Supply:{item?.supply}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {displayList.length / pageSize > 1 && (
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
                <div className={cx("ok")}>
                    <Button onClick={clickOk}>OK</Button>
                </div>
            </div>
            </Modal.Body>
        </Modal>
    );
};

export default ListModal;
