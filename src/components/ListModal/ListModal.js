import { Modal } from "@mui/material";
import React, { useState } from "react";
import styles from "./ListModal.module.scss";
import cn from "classnames/bind";
import closeIcon from "src/assets/icons/close-icon.svg";
// import DetailModal from "./DetailModal";
import { Pagination } from "antd";

const cx = cn.bind(styles);

const pageSize = 4;

const ListModal = ({ open, onHide, listNft, title, desc,selectNft }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedNft, setSelectedNft] = useState();

    const itemRender = (current, type, originalElement) => {
        if (type === "prev") {
            return <span style={{ color: "#402A7D" }}>Prev</span>;
        }
        if (type === "next") {
            return <span style={{ color: "#402A7D" }}>Next</span>;
        }
        return originalElement;
    };

    return (
        <Modal open={open} onClose={onHide}>
            <div className={cx("modal-style")}>
                <div className={cx("close-icon")} onClick={onHide}>
                    <img src={closeIcon} alt="close-icon" />
                </div>

                <div className={cx("title")}>
                    <div className={cx("big-title")}>{title}</div>
                    <div className={cx("sub-title")}>{desc}</div>
                </div>

                <div className={cx("list-nft")}>
                    {listNft.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => (
                        <div
                            className={cx("nft-item")}
                            key={index}
                            onClick={() => {
                                selectNft(item);
                                // setOpenDetailModal(true);
                            }}
                        >
                            <div
                                className={cx("top")}
                                // style={{
                                //     backgroundImage: item?.imageUrl
                                //         ? `url(${item.imageUrl})`
                                //         : `url(https://images.kawaii.global/kawaii-marketplace-image/items/201003.png)`,
                                // }}
                            >
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
                    ))}
                </div>

                <div className={cx("pagination")}>
                    <Pagination
                        pageSize={pageSize}
                        showSizeChanger={false}
                        current={currentPage}
                        total={listNft?.length}
                        onChange={page => setCurrentPage(page)}
                        itemRender={itemRender}
                    />
                </div>

                {/* <DetailModal
                    openDetailModal={openDetailModal}
                    onHide={() => setOpenDetailModal(false)}
                    selectedNft={selectedNft}
                /> */}
            </div>
        </Modal>
    );
};

export default ListModal;
