import { useEffect, useState } from "react";
import cn from "classnames/bind";
import { useHistory } from "react-router";
import { Col, Empty } from "antd";
import styles from "./ListNft.module.scss";
import NFTItem from "src/components/NFTItemStore/NFTItem";

const cx = cn.bind(styles);
const ListNft = ({ gameItemList, gameSelected,loading }) => {
    const history = useHistory();
    return (
        <>
            {gameItemList.length > 0  ? (
                gameItemList.map((item, index) => (
                    <Col xs={24} sm={12} lg={8} xxl={6} key={`nft-item-${index}`}>
                        <NFTItem
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
                    </Col>
                ))
            ) : (
                <>
                    <Empty style={{ margin: "20px auto" }} /> 
                </>
            )}
        </>
    );
};
export default ListNft;
