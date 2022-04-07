import styles from "./NavModal.module.scss";
import cn from "classnames/bind";
import logoKawaii from "../../assets/images/logo_kawaii.png";
import { useHistory, useParams } from "react-router";
import manageNftIcon from "src/assets/icons/manage-nft-icon.svg";
import storeIcon from "src/assets/icons/store-icon.svg";
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
const NavModal = ({ setOpenNav }) => {
  return (
    <div className={cx("container")}>
      <div className={cx("list")}>
        <div className={cx("item")}>About</div>
        <div className={cx("item")}>Store</div>
        <div className={cx("item")}>Game</div>
      </div>
      <span className={cx("close-btn")} onClick={() => setOpenNav(false)}>
        &times;
      </span>
      <div className={cx("filter")}>
            <div className={cx("game-info")}>
                <div className={cx("image-box")}>
                    <img src={logoKawaii} alt="game" className={cx("game-image")} />
                </div>
                <div className={cx("game-name")}>Kawaii Islands</div>
            </div>

            <div className={cx("menu")}>
                {tab.map((tab, id) => (
                    <div
                        className={cx("menu-item")}
                        key={id}
                        
                    >
                        <div className={cx("menu-title")}>
                            <img src={tab.icon} alt="icon-title" />
                            <span>{tab.name}</span>
                        </div>
                    </div>
                ))}
            </div>
                
            
        </div>
    </div>
  );
};
export default NavModal;
