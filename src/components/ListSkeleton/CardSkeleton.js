import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Col } from "antd";
import cn from "classnames/bind";
import styles from "./Card.module.scss";
const cx = cn.bind(styles);

const CardSkeleton = () => {
  return (
      <SkeletonTheme baseColor="#0f488a" highlightColor="#2e5e94" duration={2}>
        <Col xs={24} sm={12} md={8}>
          <section className={cx("skeleton")}>
            <Skeleton width={"100%"} height={270} />
            <div style={{ padding: "16px 12px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Skeleton width={28} height={28} circle={true} />
                <Skeleton width={140} height={22} style={{ marginLeft: "6px" }} />
              </div>
              <div style={{ marginTop: 8 }}></div>
              <Skeleton height={23} width={100} />
              <div style={{ marginBottom: 6 }}></div>
              <Skeleton height={26} />
            </div>
          </section>
        </Col>
      </SkeletonTheme>
  );
};
export default CardSkeleton;
