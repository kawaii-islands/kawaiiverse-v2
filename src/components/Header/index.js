import { useEffect, useState } from "react";
import logo from "src/assets/images/logo.png";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import NavModal from "./NavModal";
import ConnectWalletButton from "../ConnectWalletButton";
import { useHistory } from "react-router";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "src/helpers/hooks";

const cx = cn.bind(styles);

const Header = () => {
    const [openNav, setOpenNav] = useState(false);
    const history = useHistory();
    const context = useWeb3React();
    const { connector } = context;
    const [activatingConnector, setActivatingConnector] = useState();
    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager || !!activatingConnector);
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    return (
        <nav className={cx("navbar")}>
            <div className={cx("container")}>
                <div className={cx("menu-icon")} onClick={() => setOpenNav(!openNav)}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={cx("left")}>
                    <img src={logo} alt="Logo" className={cx("item")} onClick={() => history.push("/")} />
                    <div className={cx("list")}>
                        <div className={cx("item")} onClick={() => history.push("/about")}>
                            About
                        </div>
                        <div className={cx("item")} onClick={() => history.push("/store")}>
                            Store
                        </div>
                        <div className={cx("item")} onClick={() => history.push("/game")}>
                            Game
                        </div>
                    </div>
                </div>
                <div className={cx("cn-wallet")}>
                    <ConnectWalletButton />
                </div>
            </div>
            {openNav && <NavModal setOpenNav={setOpenNav} />}
        </nav>
    );
};

export default Header;
