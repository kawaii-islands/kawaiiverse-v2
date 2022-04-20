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
                                {console.log(selectedNft)}
                                {/* <span className={cx("value")}>{nftInfo?.description}</span> */}
                                <Grid container spacing={2}>
                                    {selectedNft?.attributes.map((info, idx) => (
                                        <Grid item container xs={6} key={idx}>
                                            <Grid item xs={4}>
                                                <div className={cx("info-image")}>
                                                    <img src={info.image}></img>
                                                </div>
                                            </Grid>
                                            <Grid item xs={8} className={cx("info-group")}>
                                                <div className={cx("info-group-header")}>{info.type}</div>
                                                <div className={cx("info-group-text")}>{info.value}</div>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DetailModal;
