import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { CloseOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import cn from "classnames/bind";
import styles from "./Item.module.scss";
import noImage from "src/assets/images/no-image.png";
import {Pagination } from "antd";
const cx = cn.bind(styles);
const ITEM_PER_PAGE = 24;
const Item = ({ list, listSell, setListSell,setCanAdd }) => {
  const [searchString, setSearchString] = useState("");
  const [listSearch, setListSearch] = useState([]);
  const [nft, setNft] = useState({});
  const [info, setInfo] = useState({
    price: 0,
    quantity: 0,
  });
  // const [totalPage, setTotalPage] = useState(1);
  const [current, setCurrent] = useState(1)
  
  const handleChange = (page) => {
    setCurrent(page);
  };
  const itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return <span style={{ color: "#FFFFFF" }}>Prev</span>;
    }
    if (type === "next") {
      return <span style={{ color: "#FFFFFF" }}>Next</span>;
    }
    return originalElement;
  };
  const handleSearch = e => {
    const value = e.target.value;
    setSearchString(value);
    if (value === "") {
      setListSearch([]);
    } else {
      const listSearch = list.filter(nft => {
        return nft._id.indexOf(value) > -1 || nft.name.indexOf(value) > -1;
      });
      setListSearch(listSearch);
    }
  };
  const addNft = id => {
    const nft = list.filter(nft => nft._id === id)[0];
    setNft(nft);
    setInfo({
      price: 0,
      quantity: nft.supply || 0,
    });
    setListSearch([]);
    setListSell([...listSell, nft]);
    setSearchString("");
    setCanAdd(true);
  };
  const handleInput = e => {
    if(!nft._id){
      return;
    }

    setInfo({ ...info, [e.target.name]: e.target.value });
    let index;
    const updateNft = list.filter((item, idx) => {
      index = idx;
      return item._id === nft._id;
    });
    updateNft[0][e.target.name] = e.target.value;
    const newList = listSell.map((item, idx) => {
      if (idx === index) {
        item = updateNft[0];
      }
      return item;
    });
    setListSell(newList);
  };
  const changeQuantity = name => {
    if(!nft._id){
      return;
    }
    let index;
    const updateNft = list.filter((item, idx) => {
      index = idx;
      return item._id === nft._id;
    });
    if (name === "minus") {
      setInfo({ ...info, quantity: Math.max(info.quantity - 1, 0) });
      updateNft[0]["quantity"] = Math.max(info.quantity - 1, 0);
    }
    if (name === "plus") {
      setInfo({ ...info, quantity: Math.min(info.quantity + 1, nft.supply) });
      updateNft[0]["quantity"] = Math.min(info.quantity + 1, nft.supply);
    }
    const newList = listSell.map((item, idx) => {
      if (idx === index) {
        item = updateNft[0];
      }
      return item;
    });

    setListSell(newList);
  };
  const deleteRow = () => {
    const id = nft._id;
    let index = listSell.findIndex(x => x._id === id);
    let newList = [...listSell];
    newList.splice(index, index);
    
    setListSell(newList)
    setNft({});
    setInfo({ price: 0, quantity: 0 });
  }
  let displayList = searchString.length > 0 ? listSearch : list;
  if(nft._id){
    displayList = []
  }
  return (
    <>
      <Row className={cx("table-body-header")}>
        <Col span={12} style={{ textAlign: "center" }}>
          {nft._id ? (
            <div className={cx("nft-image")}>
              <CloseOutlined
                className={cx("nft-image-close")}
               
                onClick={deleteRow}
              />

              <img src={nft.imageUrl || noImage} alt="" />
            </div>
          ) : (
            <input
              type="search"
              placeholder="Seach name or ID"
              className={cx("search-input")}
              value={searchString}
              onChange={handleSearch}
            />
          )}
        </Col>
        <Col span={4}>
          <input
            placeholder="---------"
            className={cx("price-input")}
            value={info.price}
            min={0} 
            
            // disabled={nft._id ? true : false}
            // disabled={true}
            type="number"
            onChange={handleInput}
            name="price"
          />
        </Col>
        <Col span={7}>
          <div className={cx("quantity")}>
            <div className={cx("quantity-btn", "quantity-minus")} onClick={() => changeQuantity("minus")}>
              -
            </div>
            <input 
				value={info.quantity} 
				min={0} 
            	max={nft.supply || 0} 
				name="quantity" 
           		onChange={handleInput} 
				className={cx("price-input")}
            // disabled={nft._id ? true : false}
            // disabled={true}
            />
            <div className={cx("quantity-btn", "quantity-plus")} name="plus" onClick={() => changeQuantity("plus")}>
              +
            </div>
          </div>
        </Col>
        <Col span={1}>
          {/* <input type="checkbox" /> */}
        </Col>
      </Row>
      <Row className={cx("result")}>
        {(displayList.length > 0 ) ? displayList.slice((current - 1) * ITEM_PER_PAGE, current * ITEM_PER_PAGE).map(nft => (
          <div className={cx("result-nft")} onClick={() => addNft(nft._id)} key={nft._id}>
            {/* <CloseOutlined className={cx("result-nft-close")}/> */}
            <img src={nft.imageUrl || noImage} alt="" />
          </div>
        )): (!nft._id ? "No result" : "")}
      </Row>
      {!nft._id && <Pagination 
      showSizeChanger={false}
      defaultCurrent={1}
      total={displayList.length}
      responsive={true}
      current={current}
      pageSize={ITEM_PER_PAGE}
      itemRender={itemRender}
      onChange={handleChange}
      className={cx("pagination")}
      />}
    </>
  );
};
export default Item;
