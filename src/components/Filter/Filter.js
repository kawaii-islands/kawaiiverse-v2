import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import styles from "./Filter.module.scss";
import logoKawaii from "../../assets/images/logo_kawaii.png";
import { useHistory, useParams } from "react-router";
import manageNftIcon from "src/assets/icons/manage-nft-icon.svg";
import storeIcon from "src/assets/icons/store-icon.svg";
import Modal from "@mui/material/Modal";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { toast } from "react-toastify";

const cx = cn.bind(styles);

const tab = [
    {
        key: 1,
        path: "manage-nft",
        name: "Manage NFT",
        icon: manageNftIcon,
    },
    {
        key: 2,
        path: "store",
        name: "Store",
        icon: storeIcon,
    },
];

const Filter = ({ gameList, setGameSelected, gameSelected, activeTab, setActiveTab, gameInfo }) => {
    const history = useHistory();
    let { address } = useParams();

    const handleGameClick = (address, idx) => {
        console.log(address);
        setGameSelected(address);
    };

    return (
        <>
            <div className={cx("filter")}>
                <div className={cx("game-info")}>
                    <div className={cx("image-box")}>
                        <img src={gameInfo.gameUrl || logoKawaii} alt="game" className={cx("game-image")} />
                    </div>

                    <div className={cx("game-name")}>
                        <div>{gameInfo.gameName || "Kawaii Islands"}</div>
                        <div style={{ fontSize: "12px", fontWeight: "400" }}>
                            {address.slice(0, 6) + "..." + address.slice(-6)} &nbsp;{" "}
                            <ContentCopyRoundedIcon
                                className={cx("icon-copy")}
                                onClick={() => {
                                    navigator.clipboard.writeText(address);
                                    toast.success("Copied!");
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className={cx("menu")}>
                    {tab.map((tab, id) => (
                        <div
                            className={cx("menu-item", activeTab === tab.key && "active")}
                            key={id}
                            onClick={() => {
                                setActiveTab(tab.key);
                                history.push(`/profile/${tab.path}/${address}`);
                            }}
                        >
                            <div className={cx("menu-title")}>
                                <img src={tab.icon} alt="icon-title" />
                                <span>{tab.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Filter;
