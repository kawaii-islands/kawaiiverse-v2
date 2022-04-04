import styles from "./NavModal.module.scss";
import cn from "classnames/bind";
const cx = cn.bind(styles);
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
    </div>
  );
};
export default NavModal;
