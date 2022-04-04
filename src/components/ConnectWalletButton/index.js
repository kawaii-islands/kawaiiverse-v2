import { useWeb3React } from "@web3-react/core";
import { formatAddress } from "src/helpers";
import ConnectWalletModal from "../ConnectWalletModal";
import { useState } from "react";
import { Button } from "@mui/material";
import styles from './index.module.scss';
import cn from "classnames/bind";
import { useHistory } from "react-router";

const cx = cn.bind();

const ConnectWalletButton = () => {
	const { account } = useWeb3React();
	const [show, setShow] = useState(false);
	const history = useHistory();

	return (
		<>
			<div
				onClick={() => {
					account ?history.push('/profile') : setShow(true);
				}}
				className={cx("cn-wallet")}
			>
				{account ? "My account" : "Connect wallet"}
			</div>
			<ConnectWalletModal show={show} setShow={setShow} />
		</>
	);
};

export default ConnectWalletButton;
