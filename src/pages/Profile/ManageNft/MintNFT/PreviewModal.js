import { Modal } from "react-bootstrap";
import React, { useState } from "react";
import styles from "./PreviewModal.module.scss";
import cn from "classnames/bind";
import closeIcon from "src/assets/icons/close-icon.svg";
import DetailModal from "./DetailModal";
import { Pagination } from "antd";
import defaultImage from "src/assets/icons/default_image.svg";

const cx = cn.bind(styles);

const pageSize = 8;

const PreviewModal = ({ open, onHide, listNft }) => {
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
        <Modal show={open} onHide={onHide} dialogClassName={cx("modal-box")} centered>
            <Modal.Body className={cx("modal-body")}>
                <div className={cx("modal-style")}>
                    <div className={cx("close-icon")} onClick={onHide}>
                        <img src={closeIcon} alt="close-icon" />
                    </div>

                    <div className={cx("title")}>
                        <div className={cx("big-title")}>PREVIEW NFT</div>
                        <div className={cx("sub-title")}>You can click on each nft to see details</div>
                    </div>

                    <div className={cx("list-nft")}>
                        {listNft.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => (
                            <div
                                className={cx("nft-item")}
                                key={index}
                                onClick={() => {
                                    setSelectedNft(item);
                                    setOpenDetailModal(true);
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
                                        src={item?.imageUrl ? `${item.imageUrl}` : defaultImage}
                                        alt="preview-img"
                                        className={cx("preview-img")}
                                    />
                                </div>

                                <div className={cx("bottom")}>
                                    <div className={cx("title")}>{item?.name || "Name"}</div>
                                    <div className={cx("nftId")}>#{item?.tokenId}</div>
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

                    <DetailModal
                        openDetailModal={openDetailModal}
                        onHide={() => setOpenDetailModal(false)}
                        selectedNft={selectedNft}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PreviewModal;
