import { Modal } from "react-bootstrap";
import React, { useState } from "react";
import styles from "./BuyNftModal.module.scss";
import cn from "classnames/bind";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import tagPrice from "src/assets/icons/tagPrice.svg";
import tagPriceSmall from "src/assets/icons/tagPriceSmall.svg";
import KWTtoken from "src/assets/icons/KWTtoken.svg";
import { Button } from "@mui/material";
import defaultImage from "src/assets/icons/default_image.svg";
import Web3 from "web3";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";

const web3 = new Web3(BSC_rpcUrls);

const cx = cn.bind(styles);

const BuyNftModal = ({ open, onHide, nftInfo, amountBuy, setAmountBuy, buyNft }) => {
    const handleInput = (e) => {
        const value = Number(e.target.value);
        if(value < 0 || (value > (Number(nftInfo?.amount) - Number(nftInfo?.alreadySale) )) ){
            return;
        }
        setAmountBuy(e.target.value)

    }
    return (
        <Modal show={open} onHide={onHide} dialogClassName={cx("modal-box")} centered>
            <Modal.Body className={cx("modal-body")}>
                <div className={cx("header")}>
                    <div className={cx("left")}>
                        <img src={tagPrice} alt="tag-price" />
                        <span className={cx("text")}>Buy item</span>
                    </div>

                    <CloseRoundedIcon className={cx("right")} onClick={onHide} />
                </div>

                <div className={cx("body")}>
                    <div className={cx("body-left")}>
                        <img src={nftInfo?.imageUrl || defaultImage} alt="icon" className={cx("image")} />
                        <div className={cx("id")}>ID: {nftInfo?.tokenId}</div>
                    </div>
                    <div className={cx("body-right")}>
                        <div className={cx("one-field")}>
                            <div className={cx("title")}>Available:</div>
                            <div className={cx("value")}>
                                <span className={cx("kwt-token")}>
                                    {Number(nftInfo?.amount) - Number(nftInfo?.alreadySale)}
                                </span>
                            </div>
                        </div>

                        <div className={cx("one-field")}>
                            <div className={cx("title")}>Price/NFT:</div>
                            <div className={cx("value")}>
                                <span className={cx("kwt-token")}>
                                    <img src={KWTtoken} alt="kwt-token" />
                                    <span>&nbsp;{web3.utils.fromWei(nftInfo?.price)}</span>
                                </span>
                                <span>$1000</span>
                            </div>
                        </div>

                        <div className={cx("one-field")} style={{ flexDirection: "column", alignItems: "baseline" }}>
                            <div className={cx("title")}>Amount:</div>
                            {/* <div className={cx("box-input")}> */}
                            <input
                                className={cx("input")}
                                placeholder="0"
                                type="number"
                                min="0"
                                onChange={handleInput}
                                pattern="^[1-9][0-9]*$"
                                value={amountBuy}
                            />
                            {/* <div className={cx("total-price")}>
                                <span style={{ color: "#4200ff" }}>
                                    {parseInt(amountBuy) ? web3.utils.fromWei(nftInfo?.price) * parseInt(amountBuy) : 0}{" "}
                                    KWT
                                </span>
                                <span style={{ color: "#e684f8" }}>$1000</span>
                            </div> */}
                        </div>

                        <div className={cx("one-field")}>
                            <div className={cx("title")}>Total price:</div>
                            <div className={cx("value")} style={{ fontWeight: "600" }}>
                                <span className={cx("kwt-token")}>
                                    <img src={KWTtoken} alt="kwt-token" />
                                    <span>
                                        &nbsp;
                                        {parseInt(amountBuy)
                                            ? web3.utils.fromWei(nftInfo?.price) * parseInt(amountBuy)
                                            : 0}{" "}
                                    </span>
                                </span>
                                <span>$1000</span>
                            </div>
                        </div>

                        <Button className={cx("button")} onClick={buyNft}>
                            <img src={tagPriceSmall} alt="tag-price" />
                            &nbsp; &nbsp; Buy
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default BuyNftModal;
