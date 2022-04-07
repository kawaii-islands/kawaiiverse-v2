import React from "react";
import styles from "./LoadingModal.module.scss";
import cn from "classnames/bind";
import iconLoading from "src/assets/images/loading1.png";
import { Modal } from "@mui/material";

const cx = cn.bind(styles);

const LoadingModal = ({ open }) => {
    return (
        <Modal open={open}>
            <div className={cx("loading-modal")}>
                <img src={iconLoading} alt="logo" className={cx("loading-logo")} />
                <p className={cx("modal-text")}>LOADING</p>
            </div>
        </Modal>
    );
};

export default LoadingModal;
