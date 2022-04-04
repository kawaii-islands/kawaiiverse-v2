import { useEffect, useState } from "react";
import cn from "classnames/bind";
import { useHistory } from "react-router";
import { Col, Empty  } from "antd";
import styles from "./ListNft.module.scss";
import NFTItem from "src/components/NFTItem/NFTItem";

const cx = cn.bind(styles);
const ListNft = ({ gameItemList }) => {
  const history = useHistory();
  return (
    <>
    {gameItemList.length > 0 ? gameItemList.map((item, index) => (
        <Col xs={24} sm={12} md={8} key={`nft-item-${index}`}>
          <NFTItem data={item} onClick={() => history.push(`/store/1`)} />
        </Col>
      )): <><h1 style={{color: 'white'}}>You own 0 Nft</h1><Empty /></> }
      
    </>
  );
};
export default ListNft;
