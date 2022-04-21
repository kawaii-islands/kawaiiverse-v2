import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Modal } from "@mui/material";
import { connectorsByName } from "src/consts/connectors";
import metamask from "src/assets/images/metamask.svg";
import walletconnectIcon from "src/assets/images/wallet-connect.svg";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Box } from "@mui/system";
import { Typography, Button, SvgIcon } from "@mui/material";
import { ReactComponent as LogoutIcon } from "src/assets/icons/log-out.svg";

const style = {
    position: "absolute",
    top: 48,
    right: 0,
    background: "#ffffff",
    color: "#3e3636",
    height: "calc(100vh - 48px)",
    padding: "30px 25px",
    maxWidth: 340,
};

const buttonStyle = {
    width: "100%",
    marginTop: 15,
    height: 58,
    justifyContent: "left",
};

const logoutStyle = {
    background: "transparent",
    position: "absolute",
    bottom: 10,
    left: 0,
    width: "100%",
    borderRadius: 0,
    paddingLeft: 2,
    justifyContent: "left",
    paddingTop: 2,
    borderTop: "1px solid #1976d2",
    "&:hover": {
        background: "transparent",
    },
};

const MetaMask = {
    name: "Metamask",
    icon: metamask,
    id: "MetaMask",
    connector: InjectedConnector,
    connectorName: "MetaMask",
};

const WalletConnect = {
    name: "Wallet Connect",
    icon: walletconnectIcon,
    id: "WalletConnect",
    connector: WalletConnectConnector,
    connectorName: "WalletConnect",
};

const CONNECTORS = [MetaMask, WalletConnect];

const ListConnector = ({ connectWallet }) => {
    return CONNECTORS.map((connector, idx) => (
        <Button
            key={idx}
            onClick={() => connectWallet(connector.connectorName, idx)}
            variant="outlined"
            style={buttonStyle}
        >
            <img src={connector.icon} alt="" />
            <Typography sx={{ ml: 2 }}>{connector.name}</Typography>
        </Button>
    ));
};

const ConnectWalletModal = ({ show, setShow, alwaysShow }) => {
    const context = useWeb3React();
    const { connector, activate, account, deactivate } = context;
    const [activatingConnector, setActivatingConnector] = useState();
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    const connectWallet = async name => {
        const currentConnector = connectorsByName[name];
        setActivatingConnector(currentConnector);
        console.log(currentConnector);
        await activate(connectorsByName[name]);
        setShow(false);
    };

    return (
        <Modal
            open={show}
            onClose={() => {
                if (alwaysShow) return;
                setShow(false);
            }}
        >
            <Box sx={style}>
                <Typography variant="h5">Connect wallet</Typography>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Connect with one of available wallet providers or create a new wallet.
                </Typography>
                <ListConnector connectWallet={connectWallet} />
                {account && (
                    <Button onClick={deactivate} sx={logoutStyle}>
                        <SvgIcon>
                            <LogoutIcon fill="#1976d2" />
                        </SvgIcon>
                        <Typography variant="subtitle1" sx={{ ml: 1 }}>
                            Log out
                        </Typography>
                    </Button>
                )}
            </Box>
        </Modal>
    );
};

export default ConnectWalletModal;
