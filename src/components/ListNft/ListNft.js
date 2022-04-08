import { useEffect, useState } from "react";
import cn from "classnames/bind";
import { useHistory } from "react-router";
import { Empty, Row } from "antd";
import styles from "./ListNft.module.scss";
import NFTItem from "src/components/NFTItem/NFTItem";

const cx = cn.bind(styles);
const ListNft = ({ gameItemList, gameSelected }) => {
    const history = useHistory();
    return (
        <>
            {gameItemList.length > 0 ? (
                <div className={cx("list-nft")}>
                    {gameItemList.map((item, index) => (
                        <NFTItem
                            key={`nft-item-${index}`}
                            isStore={true}
                            data={item}
                            handleNavigation={() =>
                                history.push({
                                    pathname: `/profile/manage-nft/${gameSelected}/${item.tokenId}`,
                                    state: { gameSelected },
                                })
                            }
                        />
                    ))}
                </div>
            ) : (
                <>
                    <Empty style={{ margin: "20px auto" }} />
                </>
            )}
        </>
    );
};
export default ListNft;
