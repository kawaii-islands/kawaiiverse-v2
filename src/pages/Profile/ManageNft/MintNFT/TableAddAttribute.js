import React, { useState } from "react";
import styles from "./TableAddAttribute.module.scss";
import cn from "classnames/bind";
import { Col, Row, Spin } from "antd";
import { create } from "ipfs-http-client";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import uploadImageIcon from "src/assets/icons/uploadImage.svg";
import defaultImage from "src/assets/icons/default_image.svg";

const cx = cn.bind(styles);
const client = create("https://ipfs.infura.io:5001/api/v0");

const TableAddAttribute = ({ listAttribute, setListAttribute, setDetailAttribute, setStateForNftData }) => {
    const [loadingUploadAttributeImg, setLoadingUploadAttributeImg] = useState(false);
    const [indexImg, setIndexImg] = useState(0);
    const [checkNameAttribute, setCheckNameAttribute] = useState(false);

    const handleUploadAttributeImage = async (e, idx) => {
        setLoadingUploadAttributeImg(true);
        const file = e.target.files[0];

        try {
            const added = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;

            setDetailAttribute("image", url, idx);
            setLoadingUploadAttributeImg(false);
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    };

    const checkNameAttributeExist = value => {
        let check = false;
        if (value) {
            for (let i = 0; i < listAttribute.length - 1; i++) {
                if (listAttribute[i].type.toLowerCase() === value.toLowerCase()) {
                    check = true;
                    break;
                }
            }
        }

        setDetailAttribute("checkName", check);
        console.log("check :>> ", check);
    };

    return (
        <div className={cx("table")}>
            <Row className={cx("header")}>
                <Col xs={5} className={cx("header-cell")}>
                    Name
                </Col>
                <Col xs={9} className={cx("header-cell")}>
                    Image
                </Col>
                <Col xs={7} className={cx("header-cell-last")}>
                    Value
                </Col>
                <Col xs={3}></Col>
            </Row>

            {listAttribute.map((item, idx) => (
                <Row className={cx("data")} key={`attr-${idx}`}>
                    <Col
                        xs={5}
                        className={cx("data-cell")}
                        style={{ flexDirection: "column", alignItems: "flex-start" }}
                    >
                        <input
                            placeholder="Name"
                            value={item?.type}
                            className={cx("input", "invalid")}
                            onChange={e => {
                                setDetailAttribute("type", e.target.value, idx);
                                checkNameAttributeExist(e.target.value);
                            }}
                        />
                        <div style={{ color: "#9e494d" }}>{"Duplicate"}</div>
                    </Col>
                    <Col xs={9} className={cx("data-cell")}>
                        {loadingUploadAttributeImg && indexImg === idx ? (
                            <Spin style={{ marginLeft: "10px" }} />
                        ) : (
                            <img src={item?.image ? item?.image : defaultImage} alt="nft-icon" width={28} height={28} />
                        )}
                        <input
                            value={item?.image}
                            placeholder="String"
                            className={cx("input")}
                            onChange={e => {
                                setDetailAttribute("image", e.target.value, idx);
                            }}
                            style={{ width: "50%", marginLeft: "5px" }}
                        />
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
                    </Col>
                    <Col xs={7} className={cx("data-cell")}>
                        <input
                            placeholder="String"
                            value={item?.value}
                            className={cx("input")}
                            onChange={e => setDetailAttribute("value", e.target.value, idx)}
                        />
                    </Col>
                    <Col xs={3} className={cx("data-cell")}>
                        <DeleteOutlinedIcon
                            className={cx("delete-icon")}
                            onClick={() => {
                                let arr = [...listAttribute];
                                arr.splice(idx, 1);
                                setListAttribute(arr);
                            }}
                        />
                    </Col>
                </Row>
            ))}
        </div>
    );
};

export default TableAddAttribute;
