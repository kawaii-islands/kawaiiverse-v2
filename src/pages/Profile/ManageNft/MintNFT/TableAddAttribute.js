import React, { useEffect, useState } from "react";
import styles from "./TableAddAttribute.module.scss";
import cn from "classnames/bind";
import { Col, Row, Spin } from "antd";
import { create } from "ipfs-http-client";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import uploadImageIcon from "src/assets/icons/uploadImage.svg";
import defaultImage from "src/assets/icons/default_image.svg";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL } from "src/consts/constant";
import _ from "lodash";

const cx = cn.bind(styles);
const client = create("https://ipfs.infura.io:5001/api/v0");

const TableAddAttribute = ({
    listAttribute,
    setListAttribute,
    setDetailAttribute,
    listAttributeError,
    setAttributeError,
    setListAttributeError,
    gameSelected,
    listNft,
    setListNft,
}) => {
    const [loadingUploadAttributeImg, setLoadingUploadAttributeImg] = useState(false);
    const [loadingUploadValueImg, setLoadingUploadValueImg] = useState(false);
    const [indexImg, setIndexImg] = useState(0);
    const [indexValue, setIndexValue] = useState(0);
    const [listAttrCurrent, setListAttrCurrent] = useState([]);
    const [listAttrBefore, setListAttrBefore] = useState([]);

    const handleUploadAttributeImage = async (e, idx) => {
        setLoadingUploadAttributeImg(true);
        const file = e.target.files[0];

        try {
            const added = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;

            setDetailAttribute("image", url, idx);
            handleSyncAttribute("image", url, listAttribute[idx]?.type);
            setLoadingUploadAttributeImg(false);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    };

    const handleUploadValueImage = async (e, idx) => {
        setLoadingUploadValueImg(true);
        const file = e.target.files[0];

        try {
            const added = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;

            setDetailAttribute("value", url, idx);
            setLoadingUploadValueImg(false);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    };

    const checkNameAttributeDuplicate = (value, index) => {
        let listAttributeErrorCopy = [...listAttributeError];

        if (!value && listAttribute[index].value) {
            listAttributeErrorCopy[index] = { ...listAttributeErrorCopy[index], nameNull: true };
            setListAttributeError(listAttributeErrorCopy);
            return;
        }

        if (value) {
            listAttributeErrorCopy[index] = { ...listAttributeErrorCopy[index], nameNull: false };
            let checkDuplicate = [];
            checkDuplicate = listAttribute?.filter(attr => attr.type.toLowerCase() === value.toLowerCase());
            if (checkDuplicate.length) {
                listAttributeErrorCopy[index] = { ...listAttributeErrorCopy[index], nameDuplicate: true };
            } else {
                listAttributeErrorCopy[index] = { ...listAttributeErrorCopy[index], nameDuplicate: false };
            }

            setListAttributeError(listAttributeErrorCopy);
        }
    };

    const checkValueNull = (value, i) => {
        if (!value && listAttribute[i].type) {
            setAttributeError("valueNull", true, i);
        } else {
            setAttributeError("valueNull", false, i);
        }
    };

    const checkNameNull = (value, i) => {
        if (!value && listAttribute[i].value) {
            setAttributeError("nameNull", true, i);
        } else {
            setAttributeError("nameNull", false, i);
        }
    };

    const getListAttributeName = async keyword => {
        if (!keyword) {
            setListAttrBefore([]);
            setListAttrCurrent([]);
            return;
        }

        let listAttrNameBefore = [];
        let uniqueAttrNameBefore = [];

        try {
            const res = await axios.get(`${URL}/v1/nft/${gameSelected.toLowerCase()}`);
            if (res.status === 200) {
                res.data.data.map((item, index) => {
                    item.attributes.map((attr, ind) => {
                        if (attr.type.toLowerCase().includes(keyword.toLowerCase())) {
                            listAttrNameBefore = [...listAttrNameBefore, attr];
                        }
                    });
                });
            }
        } catch (err) {
            console.log(err);
        }

        let tmpArr2 = listAttrNameBefore.filter(item => !listAttribute.find(i => i.type === item.type));
        uniqueAttrNameBefore = _.uniqBy(tmpArr2, "type");
        setListAttrBefore(uniqueAttrNameBefore);

        let attrCurrent = [];
        listNft.map((item, id) => {
            item.attributes?.map(attr => {
                if (attr.type.toLowerCase().includes(keyword.toLowerCase())) {
                    attrCurrent = [...attrCurrent, attr];
                }
            });
        });

        let tmpArr1 = attrCurrent.filter(
            item =>
                !listAttribute.find(i => i.type === item.type) && !uniqueAttrNameBefore.find(i => i.type === item.type),
        );
        let uniqueAttrNameCurrent = _.uniqBy(tmpArr1, "type");

        setListAttrCurrent(uniqueAttrNameCurrent);
    };

    const menu = (
        <Menu className={cx("menu-dropdown")}>
            <Menu.Item
                key={`${indexImg}-text`}
                onClick={() => {
                    setDetailAttribute("valueType", "Text", indexValue);
                    handleSyncAttribute("valueType", "Text", listAttribute[indexValue]?.type);
                }}
            >
                <div>Text</div>
            </Menu.Item>
            <Menu.Item
                key={`${indexImg}-image`}
                onClick={() => {
                    setDetailAttribute("valueType", "Image", indexValue);
                    handleSyncAttribute("valueType", "Image", listAttribute[indexValue]?.type);
                }}
            >
                <div>Image</div>
            </Menu.Item>
        </Menu>
    );

    const menuAttrName = (
        <Menu className={cx("menu-dropdown")}>
            <Menu.ItemGroup title="Current Attribute Name">
                {listAttrCurrent.map((attr, id) => (
                    <Menu.Item
                        key={`current-${id}`}
                        onClick={() => handleSelectAttribute(attr.type, attr.image, "current", attr.valueType)}
                    >
                        {attr.type}
                    </Menu.Item>
                ))}
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Before Attribute Name">
                {listAttrBefore.map((attr, id) => (
                    <Menu.Item
                        key={`before-${id}`}
                        onClick={() => handleSelectAttribute(attr.type, attr.image, "before", attr.valueType)}
                    >
                        {attr.type}
                    </Menu.Item>
                ))}
            </Menu.ItemGroup>
        </Menu>
    );

    const handleSelectAttribute = (type, image, typeAttr, valueType) => {
        setListAttrBefore([]);
        setListAttrCurrent([]);

        let listAttributeCopy = [...listAttribute];
        listAttributeCopy[indexImg] = {
            ...listAttributeCopy[indexImg],
            type: type,
            image: image,
            valueType: valueType,
        };
        setListAttribute(listAttributeCopy);

        if (typeAttr === "before") {
            setAttributeError("disable", true, indexImg);
        } else {
            setAttributeError("disable", false, indexImg);
        }
    };

    const handleSyncAttribute = (key, value, name) => {
        if (!name) {
            return;
        }

        let tmpArray = [...listNft];

        tmpArray?.map((item, id) => {
            item.attributes?.map((attr, index) => {
                if (attr.type?.toLowerCase() === name?.toLowerCase()) {
                    item.attributes[index] = { ...item.attributes[index], [key]: value };
                }
            });
        });

        console.log("tmpArray :>> ", tmpArray);

        setListNft(tmpArray);
    };

    return (
        <div className={cx("table")}>
            <Row className={cx("header")}>
                <Col xs={4} className={cx("header-cell")}>
                    Name
                </Col>
                <Col xs={7} className={cx("header-cell")}>
                    Image
                </Col>
                <Col xs={11} className={cx("header-cell-last")}>
                    Value
                </Col>
                <Col xs={2}></Col>
            </Row>

            {listAttribute.map((item, idx) => (
                <Row className={cx("data")} key={`attr-${idx}`}>
                    <Col
                        xs={4}
                        className={cx("data-cell")}
                        style={{ flexDirection: "column", alignItems: "flex-start" }}
                    >
                        <Dropdown
                            overlay={menuAttrName}
                            className={cx("drop-down")}
                            trigger={["click"]}
                            onClick={() => setIndexImg(idx)}
                        >
                            <div className={cx("drop-down-label")}>
                                <input
                                    placeholder="Name"
                                    value={item?.type}
                                    disabled={listAttributeError[idx]?.disable}
                                    className={cx(
                                        "input",
                                        (listAttributeError[idx]?.nameDuplicate || listAttributeError[idx]?.nameNull) &&
                                            "invalid",
                                    )}
                                    onChange={e => {
                                        setDetailAttribute("type", e.target.value, idx);
                                        checkNameAttributeDuplicate(e.target.value, idx);
                                        getListAttributeName(e.target.value);
                                    }}
                                    onBlur={() => checkValueNull(item.value, idx)}
                                />
                            </div>
                        </Dropdown>

                        {(listAttributeError[idx]?.nameDuplicate && (
                            <div style={{ color: "#9e494d" }}>{"Duplicate"}</div>
                        )) ||
                            (listAttributeError[idx]?.nameNull && <div style={{ color: "#9e494d" }}>{"Invalid!"}</div>)}
                    </Col>
                    <Col xs={7} className={cx("data-cell")}>
                        {loadingUploadAttributeImg && indexImg === idx ? (
                            <Spin style={{ marginLeft: "10px" }} size="small" />
                        ) : (
                            <img
                                src={item?.image ? item?.image : defaultImage}
                                alt="ic"
                                width={listAttributeError[idx]?.disable ? 32 : 20}
                                height={listAttributeError[idx]?.disable ? 32 : 20}
                            />
                        )}
                        {!listAttributeError[idx]?.disable && (
                            <input
                                value={item?.image}
                                placeholder="String"
                                className={cx("input")}
                                onChange={e => {
                                    setDetailAttribute("image", e.target.value, idx);
                                    handleSyncAttribute("image", e.target.value, item?.type);
                                }}
                                style={{ width: "50%", marginLeft: "5px" }}
                            />
                        )}

                        {!listAttributeError[idx]?.disable && (
                            <>
                                <span>&nbsp; or:</span>
                                <span className={cx("image-upload")}>
                                    <label htmlFor={`attr-image-${idx}`}>
                                        <img src={uploadImageIcon} alt="upload-img" className={cx("upload-img-icon")} />
                                    </label>
                                    <input
                                        id={`attr-image-${idx}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            setIndexImg(idx);
                                            handleUploadAttributeImage(e, idx);
                                        }}
                                    />
                                </span>
                            </>
                        )}
                    </Col>
                    <Col
                        xs={11}
                        className={cx("data-cell")}
                        style={{ flexDirection: "column", alignItems: "flex-start" }}
                    >
                        <div className={cx("content", listAttributeError[idx]?.valueNull && "invalid")}>
                            <Dropdown
                                overlay={menu}
                                className={cx("drop-down")}
                                trigger={["click"]}
                                onClick={() => setIndexValue(idx)}
                                disabled={listAttributeError[idx]?.disable}
                            >
                                <div className={cx("drop-down-label")}>
                                    <span>{item?.valueType || "Type"}</span>{" "}
                                    {!listAttributeError[idx]?.disable && <DownOutlined />}
                                </div>
                            </Dropdown>
                            <div className={cx("input-box")}>
                                {item?.valueType === "Text" ? (
                                    <input
                                        placeholder="String"
                                        value={item?.value}
                                        className={cx("input")}
                                        onChange={e => {
                                            setDetailAttribute("value", e.target.value, idx);
                                            checkValueNull(e.target.value, idx);
                                        }}
                                        onBlur={() => checkNameNull(item.type, idx)}
                                    />
                                ) : (
                                    <div>
                                        {loadingUploadValueImg && indexValue === idx ? (
                                            <Spin style={{ marginLeft: "10px" }} size="small" />
                                        ) : (
                                            <img
                                                src={item?.value ? item?.value : defaultImage}
                                                alt="ic"
                                                width={16}
                                                height={16}
                                            />
                                        )}
                                        <input
                                            value={item?.value}
                                            placeholder="String"
                                            className={cx("input")}
                                            onChange={e => {
                                                setDetailAttribute("value", e.target.value, idx);
                                                checkValueNull(e.target.value, idx);
                                            }}
                                            style={{ width: "50%", marginLeft: "5px" }}
                                            onBlur={() => checkNameNull(item.type, idx)}
                                        />
                                        <span>&nbsp; or:</span>
                                        <span className={cx("image-upload")}>
                                            <label htmlFor={`value-image-${idx}`}>
                                                <img
                                                    src={uploadImageIcon}
                                                    alt="upload-img"
                                                    className={cx("upload-img-icon")}
                                                />
                                            </label>
                                            <input
                                                id={`value-image-${idx}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={e => {
                                                    setIndexValue(idx);
                                                    handleUploadValueImage(e, idx);
                                                    checkValueNull(e.target.value, idx);
                                                }}
                                                onBlur={() => checkNameNull(item.type, idx)}
                                            />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {listAttributeError[idx]?.valueNull && (
                            <div style={{ color: "#9e494d" }}>{"Please enter value!"}</div>
                        )}
                    </Col>
                    <Col xs={2} className={cx("data-cell")} style={{ padding: "0px" }}>
                        <DeleteOutlinedIcon
                            className={cx("delete-icon")}
                            onClick={() => {
                                let arr1 = [...listAttribute];
                                let arr2 = [...listAttributeError];
                                arr1.splice(idx, 1);
                                arr2.splice(idx, 1);
                                setListAttribute(arr1);
                                setListAttributeError(arr2);
                            }}
                        />
                    </Col>
                </Row>
            ))}
        </div>
    );
};

export default TableAddAttribute;
