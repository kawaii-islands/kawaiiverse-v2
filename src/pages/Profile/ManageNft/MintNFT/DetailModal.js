import { Modal } from "react-bootstrap";
import React, { useState } from "react";
import styles from "./DetailModal.module.scss";
import cn from "classnames/bind";
import closeIcon from "src/assets/icons/close-icon.svg";
import Grid from "@mui/material/Grid";
import defaultImage from "src/assets/icons/default_image.svg";

const cx = cn.bind(styles);

const DetailModal = ({ openDetailModal, onHide, selectedNft }) => {
    return (
        <Modal show={openDetailModal} onHide={onHide} dialogClassName={cx("modal-box")} centered>
            <Modal.Body className={cx("modal-body")}>
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
                                src={selectedNft?.imageUrl ? selectedNft.imageUrl : defaultImage}
                                width="100%"
                                height="100%"
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
                            <div className={cx("content", "content-attribute")}>
                                <span className={cx("title")}>Attributes:</span>

                                <div className={cx("list-attribute")}>
                                    {selectedNft?.attributes
                                        .filter(item => item.valueType === "Text")
                                        .map((info, ind) => (
                                            <div className={cx("one-attribute")} key={ind}>
                                                <div className={cx("attr-header")}>
                                                    <img
                                                        src={info?.image ? info?.image : defaultImage}
                                                        alt="attr"
                                                        className={cx("attr-image")}
                                                    />
                                                    <div className={cx("attr-name")}>{info?.type}</div>
                                                </div>

                                                <div className={cx("attr-value")}>{info?.value}</div>
                                            </div>
                                        ))}
                                </div>

                                <div className={cx("list-attribute")}>
                                    {selectedNft?.attributes
                                        .filter(item => item.valueType === "Image")
                                        .map((info, ind) => (
                                            <div className={cx("one-attribute")} key={ind}>
                                                <div className={cx("attr-header")}>
                                                    <img
                                                        src={info?.image ? info?.image : defaultImage}
                                                        alt="attr"
                                                        className={cx("attr-image")}
                                                    />
                                                    <div className={cx("attr-name")}>{info?.type}</div>
                                                </div>

                                                <div className={cx("attr-value")}>
                                                    <img
                                                        src={info?.value ? info?.value : defaultImage}
                                                        alt="attr"
                                                        className={cx("value-image")}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DetailModal;
