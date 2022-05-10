import React, { useEffect, useState } from "react";
import styles from "./MintNFTBox.module.scss";
import cn from "classnames/bind";
import { Col, Row, Spin } from "antd";
import { useHistory } from "react-router";
import subtractIcon from "src/assets/icons/subtract.svg";
import uploadImageIcon from "src/assets/icons/uploadImage.svg";
import plusCircleIcon from "src/assets/icons/plus_circle.svg";
import TableAddAttribute from "./TableAddAttribute";
import inforIcon from "src/assets/icons/InforIcon.svg";
import { Button } from "@mui/material";
import { create } from "ipfs-http-client";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import axios from "axios";
import { URL } from "src/consts/constant";

const cx = cn.bind(styles);

let oneAttribute = {
    type: "",
    value: "",
    image: "",
	valueType: "",
};

const client = create("https://ipfs.infura.io:5001/api/v0");

const MintNFTBox = ({
    setOpenMintNFTBox,
    setStateForNftData,
    data,
    listNft,
    setListNft,
    openMintNFTBox,
    gameSelected,
}) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [loadingUploadImg, setLoadingUploadImg] = useState(false);
    const [listAttribute, setListAttribute] = useState([data.attributes]);
    const [listCategory, setListCategory] = useState([]);
    const [showListCategory, setShowListCategory] = useState(false);
    const [listCategoryDisplay, setListCategoryDisplay] = useState();

    useEffect(() => {
        setListAttribute(data.attributes);
        getListCategory();
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        setStateForNftData("attributes", listAttribute);
    }, [listAttribute]);

    const getListCategory = async () => {
        let cate = [];
        listNft.map((item, id) => {
            if (item.category) {
                cate = [...cate, item.category];
            }
        });

        let listCategory = [];
        let uniqueCategory = [];

        try {
            const res = await axios.get(`${URL}/v1/nft/${gameSelected.toLowerCase()}`);
            if (res.status === 200) {
                res.data.data.map((item, index) => {
                    if (item.category) {
                        listCategory = [...listCategory, item.category];
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }

        listCategory = [...listCategory, ...cate];
        uniqueCategory = [...new Set(listCategory)];
        setListCategory(uniqueCategory);
        setListCategoryDisplay(uniqueCategory);
    };

    const setDetailAttribute = (key, value, index) => {
        let listAttributeCopy = [...listAttribute];
        listAttributeCopy[index] = { ...listAttributeCopy[index], [key]: value };

        setListAttribute(listAttributeCopy);
    };

    const handleUploadImage = async e => {
        setLoadingUploadImg(true);
        const file = e.target.files[0];

        try {
            const added = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;

            setStateForNftData("imageUrl", url);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }

        setLoadingUploadImg(false);
    };

    const handleSelectCategory = value => {
        let result = [...listCategory];
        if (value) {
            result = listCategory.filter(item => item.toLowerCase().includes(value.toLowerCase()));
        }
        setListCategoryDisplay(result);
    };

    return (
        <div className={cx("mintNFT-box")}>
            <div className={cx("main-box")}>
                <Row className={cx("one-field")}>
                    <Col span={4} className={cx("title")}>
                        Category:
                    </Col>
                    <Col span={20}>
                        <input
                            value={data.category}
                            placeholder="Enter category"
                            className={cx("input")}
                            onFocus={() => setShowListCategory(true)}
                            // onBlur={() => !selected && setShowListCategory(false)}
                            onChange={e => {
                                setStateForNftData("category", e.target.value);
                                handleSelectCategory(e.target.value);
                            }}
                        />
                        {showListCategory && (
                            <div className={cx("card")}>
                                {listCategoryDisplay?.map(
                                    (category, index) =>
                                        category && (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setStateForNftData("category", category);
                                                    setShowListCategory(false);
                                                }}
                                                className={cx("valueSelect")}
                                            >
                                                {category}
                                            </div>
                                        ),
                                )}
                            </div>
                        )}
                    </Col>
                </Row>

                <Row className={cx("one-field")}>
                    <Col span={4} className={cx("title")}>
                        Rarity:
                    </Col>
                    <Col span={20}>
                        <input
                            value={data.rarity}
                            placeholder="Enter rarity"
                            className={cx("input")}
                            onChange={e => setStateForNftData("rarity", e.target.value)}
                        />
                    </Col>
                </Row>

                <Row className={cx("one-field")}>
                    <Col span={4} className={cx("title")}>
                        Description:
                    </Col>
                    <Col span={20}>
                        <input
                            value={data.description}
                            placeholder="Enter description"
                            className={cx("input")}
                            onChange={e => setStateForNftData("description", e.target.value)}
                        />
                    </Col>
                </Row>

                <Row className={cx("one-field")}>
                    <Col span={4} className={cx("title")}>
                        Attributes:
                    </Col>
                    <Col span={20} className={cx("table-attribute")}>
                        <div className={cx("table")}>
                            <TableAddAttribute
                                listAttribute={listAttribute}
                                setListAttribute={setListAttribute}
                                setDetailAttribute={setDetailAttribute}
                                setStateForNftData={setStateForNftData}
                            />
                        </div>
                        <div
                            className={cx("add-attribute")}
                            onClick={() => setListAttribute([...listAttribute, oneAttribute])}
                        >
                            <img src={plusCircleIcon} alt="add-icon" className={cx("add-icon")} /> Add attribute
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MintNFTBox;
