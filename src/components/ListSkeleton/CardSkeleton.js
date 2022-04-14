import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Col } from "antd";
import cn from "classnames/bind";
import styles from "./Card.module.scss";
const cx = cn.bind(styles);

const CardSkeleton = ({page}) => {
  return (
      <SkeletonTheme baseColor="#3D1C6C" highlightColor="#402A7D" duration={2}>
        <div className={cx("nft-skeleton")}>
          <section className={cx("skeleton")}>
            <Skeleton width={"100%"} height={270} />
            <div style={{ padding: "16px 12px" }}>
              
              <div style={{ marginTop: 8 }}></div>
              <Skeleton height={23} width={150} />
              <div style={{ marginBottom: 6 }} ></div>
              <Skeleton height={26} width={100}/>
              {page === "store" && <><div style={{ marginBottom: 4 }} ></div>
              <Skeleton height={32} width={"100%"} style={{background: "#3D1C6C"}} /></>}
            </div>
          </section>
        </div>
      </SkeletonTheme>
  );
};
export default CardSkeleton;
