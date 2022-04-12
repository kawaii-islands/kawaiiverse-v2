import React, { useState } from "react";

import cn from "classnames/bind";
import styles from "./index.module.scss";
import ViewItemNFT from "./ViewItemNFT";
import SellItemNFT from "./SellItemNFT";

const cx = cn.bind(styles);
const StoreProfile = ({ gameSelected }) => {
  const [isSellNFT, setIsSellNFT] = useState(false);
  return (
    <div className={cx("profile")}>
      <div className={cx("right")}>
        <div className={cx("content")}>
          {isSellNFT ? <SellItemNFT gameSelected={gameSelected} setIsSellNFT={setIsSellNFT} isSellNFT={isSellNFT}/> : <ViewItemNFT gameSelected={gameSelected} isSellNFT={isSellNFT} setIsSellNFT={setIsSellNFT}/>}
        </div>
      </div>
    </div>
  );
};

export default StoreProfile;
