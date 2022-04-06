import { useEffect, useState } from "react";
import cn from "classnames/bind";
import { useHistory } from "react-router";
import { Col, Empty } from "antd";
import styles from "./ListNft.module.scss";
import NFTItem from "src/components/NFTItemStore/NFTItem";

const cx = cn.bind(styles);
const ListNft = ({ gameItemList, gameSelected }) => {
    const history = useHistory();
    return (
        <>
            {gameItemList.length > 0 ? (
                gameItemList.map((item, index) => (
                    <Col xs={24} sm={12} lg={8} xxl={6} key={`nft-item-${index}`}>
                        <NFTItem
                            data={item}
                            handleNavigation={() =>
                                history.push({
                                    pathname: `/profile/manage-nft/${gameSelected}/${item.tokenId}`,
                                    state: { gameSelected },
                                })
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
