import cn from "classnames/bind";
import styles from "./Item.module.scss";
const cx = cn.bind(styles);
const Item = () => {
    return (
        <div className={cx("item-div")}>
            <div></div>
        </div>
    );
};
export default Item;
