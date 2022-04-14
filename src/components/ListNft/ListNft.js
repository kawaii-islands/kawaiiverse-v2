import { useEffect, useState } from "react";
import cn from "classnames/bind";
import { useHistory } from "react-router";
import { Empty, Row } from "antd";
import styles from "./ListNft.module.scss";
import NFTItem from "src/components/NFTItem/NFTItem";

const cx = cn.bind(styles);
const ListNft = ({ gameItemList, gameSelected,loading }) => {
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
                            handleNavigation={() =>{
                                // localStorage.setItem("nft", JSON.stringify(item));
                                history.push({
                                    pathname: `/profile/store/view-nft/${gameSelected}/${item._id}/${item.tokenId}`,
                                    state: { gameSelected },
                                })
                            }
                                
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
