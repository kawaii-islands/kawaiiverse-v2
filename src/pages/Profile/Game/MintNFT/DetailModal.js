import { Modal } from "@mui/material";
import React, { useState } from "react";
import styles from "./DetailModal.module.scss";
import cn from "classnames/bind";
import closeIcon from "src/assets/icons/close-icon.svg";

const cx = cn.bind(styles);

const DetailModal = ({ openDetailModal, onHide, selectedNft }) => {
    return (
        <Modal open={openDetailModal} onClose={onHide}>
            <div className={cx("modal-style")}>
                <div className={cx("close-icon")} onClick={onHide}>
                    <img src={closeIcon} alt="close-icon" />
                </div>

                <div className={cx("title")}>
                    <div className={cx("big-title")}>PREVIEW NFT</div>
                </div>

                <div className={cx("main-content")}>
                    <div className={cx("left")}>
                        <img
                            src={
                                selectedNft?.imageUrl
                                    ? selectedNft.imageUrl
                                    : `https://images.kawaii.global/kawaii-marketplace-image/items/206008.png`
                            }
                            width="100%"
                            alt="nft"
                        />
                    </div>
                    <div className={cx("right")}>
                        <div className={cx("title")}>
                            <span className={cx("first")}>{selectedNft?.name || "Name"}</span>
                            <span className={cx("second")}>#{selectedNft?.tokenId || "123456"}</span>
                        </div>
                        <div className={cx("third")}>{selectedNft?.category || "Category"}</div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Supply:</span>
                            <span className={cx("value")}>{selectedNft?.supply || "100"}</span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Author:</span>
                            <span className={cx("value")}>{selectedNft?.author}</span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Description:</span>
                            <span className={cx("value")}>{selectedNft?.description}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DetailModal;
