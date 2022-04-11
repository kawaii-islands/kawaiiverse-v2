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
    rowItem,
    setRowItem,
}) => {
    // const [search, setSearch] = useState({
    //     name: "",
    //     tokenId: "",
    // });
    // const [listSearch, setListSearch] = useState([]);
    const [nft, setNft] = useState({});
    const [info, setInfo] = useState({
        price: 0,
        quantity: 0,
    });
    const [showError, setShowError] = useState({
        price: false,
        quantity: false,
    });
    const [showModal, setShowModal] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const selectNft = nft => {
        setNft({ ...nft });
        setShowModal(false);
        setListSell([...listSell, nft]);
        let newList = [...list];
        newList = newList.filter(item => item._id !== nft._id);
        setList(newList);
        setSubmitted(false)
        setRowItem(rowItem + 1);
        
    };

    useEffect(() => {
        let newError = { ...showError };
        if ((info.price === 0 || info.price === "0") && submitted) {
            newError.price = true;
        }
        if ((info.quantity === 0 || info.quantity === "0") && submitted) {
            newError.quantity = true;
        }
        setShowError(newError);
    }, [submitted]);
    // const handleSearch = e => {
    //     const { name, value } = e.target;

    //     setSearch({
    //         ...search,
    //         [name]: value,
    //     });
    //     if (name === "tokenId") {
    //         let array = list;
    //         let newListSearch = array.filter(nft => {
    //             return nft.tokenId.toString().indexOf(value) > -1;
    //         });

    //         let newListSearch2 = newListSearch.filter(nft => {
    //             return listSell.indexOf(nft) === -1;
    //         });

    //         setListSearch(newListSearch2);
    //     }
    //     if (name === "name") {
    //         let array = list;
    //         let newListSearch = array.filter(nft => {
    //             return nft.name.indexOf(value) > -1;
    //         });

    //         let newListSearch2 = newListSearch.filter(nft => {
    //             return listSell.indexOf(nft) === -1;
    //         });

    //         setListSearch(newListSearch2);
    //     }
    // };
    // const addNft = id => {
    //     const newNft = list.filter(nft => nft._id === id)[0];
    //     setSubmitted(false);
    //     setShowError(false);
    //     setInfo({
    //         price: 0,
    //         quantity: 1,
    //     });
    //     setSearch({
    //         name: newNft.name,
    //         tokenId: newNft.tokenId,
    //     });
    //     let newList = [...listSell];
    //     newList = newList.filter((item, idx) => {
    //         return item._id !== nft._id;
    //     });
    //     setListSearch([]);
    //     setListSell([...newList]);
    //     setInfo({ price: 0, quantity: 0 });
    //     setListSell([...newList, { ...newNft, quantity: newNft.supply || 0, price: 0 }]);

    //     setNft({
    //         ...newNft,
    //         quantity: newNft.supply,
    //         price: 0,
    //     });

    //     setCanAdd(true);
    // };

    const handleInput = e => {
        if (!nft._id) {
            return;
        }
        // const pattern = /^0[0-9]/;
        // console.log();
        // if(pattern.test(e.target.value)){
        //     console.log(Number(e.target.value).toString());
        // }
        setShowError({...showError, [e.target.name]: false});
        // setSubmitted(false);
        if (e.target.name === "quantity") {
            if (Number(e.target.value) > nft.supply) return;
        }
        setInfo({ ...info, [e.target.name]: Number(e.target.value).toString() });
        setNft({ ...nft, [e.target.name]: Number(e.target.value).toString() });
        let index;
        const updateNft = listSell.filter((item, idx) => {
            if (item._id === nft._id) {
                index = idx;
                return item._id === nft._id;
            }
            return false;
        });
        updateNft[0][e.target.name] = Number(e.target.value).toString();
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
        // setShowError(false);
        setShowError({...showError, quantity: false})
        // setSubmitted(false);

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

    const deleteRow = nft => {
        let newList = [...listSell];
        newList = newList.filter((item, idx) => {
            return item._id !== nft._id;
        });
        nft.amount = 0;
        nft.price = 0;
        setList([...list, nft]);

        setListSell([...newList]);
        setCanAdd(true);
        setNft({});
        setInfo({ price: 0, quantity: 0 });
        if (index + 1 < rowItem) {
            setDeleted(true);
            return;
        }
        setRowItem(rowItem - 1);
    };
    return (
        <>
            <Row className={cx("container", deleted && "container-hide")}>
                {!nft._id ? (
                    <div className={cx("add")} onClick={() => setShowModal(true)}>
                        <img src={addRowItem} alt="add" className={cx("add-icon")} />{" "}
                        <span className={cx("add-title")}>Choose NFT</span>
                    </div>
                ) : (
                    <>
                        <>
                            <Col span={3} style={{ textAlign: "center" }} className={cx("search")}>
                                <img alt="nft" src={nft.imageUrl} className={cx("nft-image")} />
                            </Col>
                            <Col span={3} style={{ textAlign: "center" }} className={cx("search")}>
                                {nft.tokenId}
                            </Col>
                            <Col span={3} style={{ textAlign: "center" }} className={cx("search")}>
                                {nft.name}
                            </Col>

                            <Col span={3} style={{ textAlign: "center" }} className={cx("input-wrapper")}>
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
                                {showError.price && (
                                    <div className={cx("error")}>Please set price greater than 0</div>
                                )}
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
                                {showError.quantity && (
                                    <div className={cx("error")}>Please set quantity greater than 0</div>
                                )}
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
                        </>
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
        // <>
        //     <Row className={cx("table-body")}>
        //         {/* <img src={addRowItem} alt="add-icon" className={cx("add-icon")} onClick={addItem} /> */}
        //         <Col span={4} style={{ textAlign: "center" }} className={cx("search")}>
        //             <input
        //                 type="string"
        //                 placeholder="Search ID"
        //                 className={cx("search-input")}
        //                 name="tokenId"
        //                 autoComplete="off"
        //                 value={search.tokenId}
        //                 onChange={handleSearch}
        //             />
        //             <div className={cx("dropdown")}>
        //                 {listSearch.length > 0 &&
        //                     search.tokenId &&
        //                     listSearch.map((i, idx) => {
        //                         return (
        //                             <div onClick={() => addNft(i._id)} key={`search-tokenId-${idx}`}>
        //                                 {i.tokenId}
        //                             </div>
        //                         );
        //                     })}
        //             </div>
        //         </Col>
        //         <Col span={4} style={{ textAlign: "center" }} className={cx("search")}>
        //             <input
        //                 type="string"
        //                 placeholder="Search name"
        //                 name="name"
        //                 autoComplete="off"
        //                 className={cx("search-input")}
        //                 value={search.name}
        //                 onChange={handleSearch}
        //             />
        //             <div className={cx("dropdown")}>
        //                 {listSearch.length > 0 &&
        //                     search.name &&
        //                     listSearch.map((i, idx) => {
        //                         return (
        //                             <div onClick={() => addNft(i._id)} key={`search-name-${idx}`}>
        //                                 {i.name}
        //                             </div>
        //                         );
        //                     })}
        //             </div>
        //         </Col>

        //         <Col span={4} style={{ textAlign: "center" }}>
        //             <input
        //                 className={cx("price-input")}
        //                 value={info.price}
        //                 min={0}
        //                 // disabled={nft._id ? true : false}
        //                 // disabled={true}
        //                 type="number"
        //                 onChange={handleInput}
        //                 name="price"
        //                 pattern="^[1-9][0-9]*$"
        //             />
        //         </Col>
        //         <Col span={4} style={{ textAlign: "center" }}>
        //             <div className={cx("quantity")}>
        //                 <div className={cx("quantity-btn", "quantity-minus")} onClick={() => changeQuantity("minus")}>
        //                     -
        //                 </div>
        //                 <input
        //                     value={info.quantity}
        //                     min={0}
        //                     max={nft.supply || 0}
        //                     name="quantity"
        //                     onChange={handleInput}
        //                     className={cx("price-input")}
        //                     // disabled={nft._id ? true : false}
        //                     // disabled={true}
        //                     pattern="^[1-9][0-9]*$"
        //                 />
        //                 <div
        //                     className={cx("quantity-btn", "quantity-plus")}
        //                     name="plus"
        //                     onClick={() => changeQuantity("plus")}
        //                 >
        //                     +
        //                 </div>
        //             </div>
        //         </Col>
        //         <Col span={4} style={{ textAlign: "center", color: "#402A7D", fontWeight: "bold" }}>
        //             {nft.supply || 0}
        //         </Col>
        //         <Col span={4} style={{ textAlign: "center" }}>
        //             {/* <input type="checkbox" style={{background: "#A4B8EA"}} /> */}
        //             <div onClick={() => deleteRow(nft._id)}>X</div>
        //         </Col>
        //     </Row>
        //     {submitted && showError && (nft.quantity <= 0 || nft.price <= 0) && (
        //         <div style={{ color: "red", padding: 20 }}>Please set price and quantity greater than 0</div>
        //     )}
        // </>
    );
};
export default Item;
