import React, { useEffect, useState } from "react";

import { Col, Row } from "antd";
import cn from "classnames/bind";
import styles from "./Item.module.scss";
import addRowItem from "src/assets/icons/addRowItem.svg";
import ListModal from "src/components/ListModal/ListModal";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const cx = cn.bind(styles);
const Item = ({
    setList,
    list,
    index,
    listSell,
    setListSell,
    setCanAdd,
    addItem,
    submitted,
    setSubmitted,
    
    success,
    setSuccess,
    nft,
}) => {
    const [showError, setShowError] = useState({
        price: false,
        quantity: false,
    });
    const [showModal, setShowModal] = useState(false);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        if (success) {
            setSubmitted(false);

            setDeleted(false);
        }
    }, [success]);
    useEffect(() => {
        let newError = { ...showError };
        
        if ((!nft.price || !nft.price === "0" || nft.price === 0) && submitted) {
            newError.price = true;
        }
        if ((!nft.quantity  || !nft.quantity === "0" || nft.quantity === 0) && submitted) {
            newError.quantity = true;
        }
        
        setShowError({...newError});
    }, [submitted]);
    // const selectNft = nft => {
    //     setNft({ ...nft });
    //     setShowModal(false);
    //     setListSell([...listSell, nft]);
    //     let newList = [...list];
    //     newList = newList.filter(item => item._id !== nft._id);
    //     setList(newList);
    //     setSubmitted(false);
    //     setRowItem(rowItem + 1);
    //     setShowError({price: false, quantity: false})
    //     // setSuccess(false);
    // };

    const selectNft = listNft => {
        setListSell([...listSell, ...listNft]);
        
        setShowModal(false);
        setSubmitted(false);
        setShowError({price: false, quantity: false});
    };

    const handleInput = e => {
        // if (!nft._id) {
        //     return;
        // }
        // const pattern = /^0[0-9]/;
        // console.log();
        // if(pattern.test(e.target.value)){
        //     console.log(Number(e.target.value).toString());
        // }
        if(Number(e.target.value) === 0){
            setShowError({ ...showError, [e.target.name]: true });
        }else{
            setShowError({ ...showError, [e.target.name]: false });
        }
        
        setSubmitted(false);
        if (e.target.name === "quantity") {
            if (Number(e.target.value) > nft.supply) return;
        }
        let index;
        const updateNft = listSell.filter((item, idx) => {
            if (item.tokenId === nft.tokenId) {
                index = idx;
                return item.tokenId === nft.tokenId;
            }
            return false;
        });
        const updateNft2 = JSON.parse(JSON.stringify(updateNft))
        // clone deep
        updateNft2[0][e.target.name] = Number(e.target.value).toString();
        const newList = listSell.map((item, idx) => {
            if (idx === index) {
                item = updateNft2[0];
            }
            return item;
        });
        setListSell([...newList]);
    };

    const changeQuantity = name => {
        if (!nft.tokenId) {
            return;
        }
        nft.quantity = nft.quantity || 0;

        // setShowError(false);
        setShowError({ ...showError, quantity: false });
        setSubmitted(false);

        let index;
        const updateNft = listSell.filter((item, idx) => {
            if (item.tokenId === nft.tokenId) {
                index = idx;
                return item.tokenId === nft.tokenId;
            }
            return false;
        });
        const updateNft2 = JSON.parse(JSON.stringify(updateNft));
        // clone deep

        if (name === "minus") {
            updateNft[0]["quantity"] = Math.max(Number(nft.quantity) - 1, 0);
        }
        if (name === "plus") {
            updateNft[0]["quantity"] = Math.min(Number(nft.quantity) + 1, nft.supply);
        }
        const newList = listSell.map((item, idx) => {
            if (idx === index) {
                item = updateNft2[0];
            }
            return item;
        });

        setListSell([...newList]);
    };

    const deleteRow = nft => {
        let newList = [...listSell];
        newList = newList.filter((item, idx) => {
            return item.tokenId !== nft.tokenId;
        });

        
        
        
        setListSell([...newList]);
        setCanAdd(true);
        
        
    };
    list = list.filter(function (val) {
        return listSell.indexOf(val) === -1;
    });
    
    return (
        <>
            <Row className={cx("container", deleted && !success && "container-hide")}>
                {!nft._id ? (
                    <div className={cx("add")} onClick={() => setShowModal(true)}>
                        <img src={addRowItem} alt="add" className={cx("add-icon")} />{" "}
                        <span className={cx("add-title")}>Choose NFT</span>
                    </div>
                ) : (
                    <>
                        <Row>
                            <Col span={3} style={{ textAlign: "center" }} className={cx("search")}>
                                <img alt="nft" src={nft.imageUrl} className={cx("nft-image")} />
                            </Col>
                            <Col span={3} style={{ textAlign: "center" }} className={cx("search")}>
                                {nft.tokenId}
                            </Col>
                            <Col span={3} style={{ textAlign: "center" }} className={cx("search")}>
                                {nft.name}
                            </Col>

                            <Col span={4} style={{ textAlign: "center" }} className={cx("input-wrapper")}>
                                <input
                                    className={cx("price-input", showError.price && "error-input")}
                                    value={nft.price || 0}
                                    min={0}
                                    // disabled={nft._id ? true : false}
                                    // disabled={true}
                                    type="number"
                                    onChange={handleInput}
                                    name="price"
                                    pattern="^[1-9][0-9]*$"
                                />
                            </Col>
                            <Col span={5} style={{ textAlign: "center" }} className={cx("input-wrapper")}>
                                <div className={cx("quantity")}>
                                    <div
                                        className={cx("quantity-btn", "quantity-minus")}
                                        onClick={() => changeQuantity("minus")}
                                    >
                                        -
                                    </div>
                                    <input
                                        value={nft.quantity || 0}
                                        min={0}
                                        max={nft.supply || 0}
                                        name="quantity"
                                        onChange={handleInput}
                                        className={cx("price-input", showError.quantity && "error-input")}
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
                            <Col span={3} style={{ textAlign: "center", color: "#402A7D", fontWeight: "bold" }}>
                                {nft.supply || 0}
                            </Col>
                            <Col span={3} style={{ textAlign: "center" }}>
                                {/* <input type="checkbox" style={{background: "#A4B8EA"}} /> */}
                                <div onClick={() => deleteRow(nft)} className={cx("delete-icon")}>
                                    <DeleteOutlinedIcon />
                                </div>
                            </Col>
                        </Row>
                        <Row className={cx("row-error")}>
                            <Col span={3} style={{ textAlign: "center" }}></Col>
                            <Col span={3} style={{ textAlign: "center" }}></Col>
                            <Col span={3} style={{ textAlign: "center" }}></Col>
                            <Col span={4} style={{ textAlign: "center" }}>
                                {showError.price && <div className={cx("error")}>Price greater than 0</div>}
                            </Col>
                            <Col span={5} style={{ textAlign: "center" }}>
                                {showError.quantity && <div className={cx("error")}>Quantity greater than 0</div>}
                            </Col>
                            <Col span={3} style={{ textAlign: "center" }}></Col>
                            <Col span={3} style={{ textAlign: "center" }}></Col>
                        </Row>
                    </>
                )}
            </Row>

            <ListModal
                open={showModal}
                onHide={() => setShowModal(false)}
                listNft={list}
                title={"Select NFT"}
                desc={""}
                selectNft={selectNft}
            />
        </>
    );
};
export default Item;
