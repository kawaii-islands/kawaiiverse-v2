import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { CloseOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import cn from "classnames/bind";
import styles from "./Item.module.scss";
import addRowItem from "src/assets/icons/addRowItem.svg";

const cx = cn.bind(styles);
const Item = ({ list, listSell, setListSell, setCanAdd, addItem, submitted, setSubmitted, rowItem, setRowItem }) => {
    const [search, setSearch] = useState({
        name: "",
        tokenId: "",
    });
    const [listSearch, setListSearch] = useState([]);
    const [nft, setNft] = useState({});
    const [info, setInfo] = useState({
        price: 0,
        quantity: 0,
    });
    const [showError, setShowError] = useState(true);
    useEffect(() => {
        setShowError(true);
    }, [submitted]);
    const handleSearch = e => {
        const { name, value } = e.target;
        setSearch({
            ...search,
            [name]: value,
        });
        if (name === "tokenId") {
            let array = listSearch.length > 0 ? listSearch : list;
            let newListSearch = array.filter(nft => {
                return nft.tokenId.toString().indexOf(value) > -1;
            });
            newListSearch = newListSearch.filter(nft => {
                return listSell.indexOf(nft) === -1;
            });
            setListSearch(newListSearch);
        }
        if (name === "name") {
            let array = listSearch.length > 0 ? listSearch : list;
            let newListSearch = array.filter(nft => {
                return nft.name.indexOf(value) > -1;
            });
            newListSearch = newListSearch.filter(nft => {
                return listSell.indexOf(nft) === -1;
            });
            setListSearch(newListSearch);
        }
    };
    const addNft = id => {
        const nft = list.filter(nft => nft._id === id)[0];
        setSubmitted(false);
        setShowError(false);
        setNft({
            ...nft,
            quantity: nft.supply,
            price: 0,
        });
        setInfo({
            price: 0,
            quantity: nft.supply || 0,
        });
        setSearch({
            name: nft.name,
            tokenId: nft.tokenId,
        });
        setListSearch([]);
        setListSell([...listSell, { ...nft, quantity: nft.supply || 0, price: 0 }]);

        setCanAdd(true);
    };
    const handleInput = e => {
        if (!nft._id) {
            return;
        }
        setShowError(false);
        setSubmitted(false);

        setInfo({ ...info, [e.target.name]: Number(e.target.value) });
        setNft({ ...nft, [e.target.name]: Number(e.target.value) });
        let index;
        const updateNft = listSell.filter((item, idx) => {
            if (item._id === nft._id) {
                index = idx;
                return item._id === nft._id;
            }
        });
        updateNft[0][e.target.name] = e.target.value;
        const newList = listSell.map((item, idx) => {
            if (idx === index) {
                item = updateNft[0];
            }
            return item;
        });
        setListSell([...newList]);
    };
    const changeQuantity = name => {
        if (!nft._id) {
            return;
        }
        setShowError(false);
        setSubmitted(false);

        let index;
        const updateNft = listSell.filter((item, idx) => {
            if (item._id === nft._id) {
                index = idx;
                return item._id === nft._id;
            }
            return false;
        });
        if (name === "minus") {
            setInfo({ ...info, quantity: Math.max(info.quantity - 1, 0) });
            setNft({ ...nft, quantity: Math.max(info.quantity - 1, 0) });
            updateNft[0]["quantity"] = Math.max(info.quantity - 1, 0);
        }
        if (name === "plus") {
            setInfo({ ...info, quantity: Math.min(info.quantity + 1, nft.supply) });
            setNft({ ...nft, quantity: Math.min(info.quantity + 1, nft.supply) });
            updateNft[0]["quantity"] = Math.min(info.quantity + 1, nft.supply);
        }
        const newList = listSell.map((item, idx) => {
            if (idx === index) {
                item = updateNft[0];
            }
            return item;
        });

        setListSell([...newList]);
    };
    const deleteRow = (id) => {
        let newList = [...listSell];
        newList = newList.filter((item,idx) => {
            return item._id !== id;
        } );
        setRowItem(rowItem - 1);
        setListSell([...newList]);
        setCanAdd(true)
        setNft({});
        setInfo({ price: 0, quantity: 0 });
    };
    return (
        <>
            <Row className={cx("table-body-header")}>
                {/* <img src={addRowItem} alt="add-icon" className={cx("add-icon")} onClick={addItem} /> */}
                <Col span={4} style={{ textAlign: "center" }} className={cx("search")}>
                    <input
                        type="string"
                        placeholder="Search ID"
                        className={cx("search-input")}
                        name="tokenId"
                        autoComplete="off"
                        value={search.tokenId}
                        onChange={handleSearch}
                    />
                    <div className={cx("dropdown")}>
                        {listSearch.length > 0 &&
                            search.tokenId &&
                            listSearch.map((i, idx) => {
                                return (
                                    <div onClick={() => addNft(i._id)} key={`search-tokenId-${idx}`}>
                                        {i.tokenId}
                                    </div>
                                );
                            })}
                    </div>
                </Col>
                <Col span={4} style={{ textAlign: "center" }} className={cx("search")}>
                    <input
                        type="string"
                        placeholder="Search name"
                        name="name"
                        autoComplete="off"
                        className={cx("search-input")}
                        value={search.name}
                        onChange={handleSearch}
                    />
                    <div className={cx("dropdown")}>
                        {listSearch.length > 0 &&
                            search.name &&
                            listSearch.map((i, idx) => {
                                return (
                                    <div onClick={() => addNft(i._id)} key={`search-name-${idx}`}>
                                        {i.name}
                                    </div>
                                );
                            })}
                    </div>
                </Col>

                <Col span={4} style={{ textAlign: "center" }}>
                    <input
                        className={cx("price-input")}
                        value={info.price}
                        min={0}
                        // disabled={nft._id ? true : false}
                        // disabled={true}
                        type="number"
                        onChange={handleInput}
                        name="price"
                        pattern="^[1-9][0-9]*$"
                    />
                </Col>
                <Col span={4} style={{ textAlign: "center" }}>
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
                            pattern="^[1-9][0-9]*$"
                        />
                        <div
                            className={cx("quantity-btn", "quantity-plus")}
                            name="plus"
                            onClick={() => changeQuantity("plus")}
                        >
                            +
                        </div>
                    </div>
                </Col>
                <Col span={4} style={{ textAlign: "center", color: "#402A7D", fontWeight: "bold" }}>
                    {nft.supply || 0}
                </Col>
                <Col span={4} style={{ textAlign: "center" }}>
                    {/* <input type="checkbox" style={{background: "#A4B8EA"}} /> */}
                    <div onClick={() => deleteRow(nft._id)}>X</div>
                </Col>
            </Row>
            {submitted && showError && (nft.quantity <= 0 || nft.price <= 0) && (
                <div style={{ color: "red", padding: 20 }}>Please set price and quantity greater than 0</div>
            )}
        </>
    );
};
export default Item;
