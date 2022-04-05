import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import styles from "./NFTItem.module.scss";

import Web3 from "web3";
import { BSC_rpcUrls } from "src/consts/blockchain";

const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const NFTItem = ({ onClick, data, handleNavigation }) => {
    return (
        <div className={cx("nft-item")} onClick={handleNavigation}>
            <div
                className={cx("top")}
                style={{
                    backgroundImage: data?.imageUrl
                        ? `url(${data.imageUrl})`
                        : `url(https://images.kawaii.global/kawaii-marketplace-image/items/205002.png)`,
                }}
            >
                <div className={cx("tag")}>
                    {data.amount - data.alreadySale}/{data.amount || data.supply} Left
                </div>
            </div>

            <div className={cx("bottom")}>
                <div className={cx("name")}>
                    <span className={cx("name-text")}>{data?.name || "Name"}</span>
                </div>
                <div className={cx("title")}>#{data?.tokenId}</div>
                <div className={cx("number-box")}>
                    <span className={cx("number")}>
                        {data.price ? Number(web3.utils.fromWei(data.price.toString())) : 0} KWT
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NFTItem;
