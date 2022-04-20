import React, { useEffect, useState } from "react";
import styles from "./NFTDetail.module.scss";

import cn from "classnames/bind";
import MainLayout from "src/components/MainLayout";
import { Col, Row } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import { URL } from "src/consts/constant";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
const cx = cn.bind(styles);

const NFTDetail = () => {
    const history = useHistory();
    const { nftId, address } = useParams();
    const [nftInfo, setNftInfo] = useState();
    const [loading, setLoading] = useState(true);
    const { pathname } = useLocation();
    useEffect(() => {
        getNftInfo();
    }, []);
    let pathnames = pathname.split("/").filter(Boolean);
    pathnames.splice(5, 1);
    pathnames.splice(2, 1);
    const getNftInfo = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${URL}/v1/nft/${address.toLowerCase()}/${nftId}`);
            setNftInfo(res.data.data);
            console.log(res.data.data);
            console.log("res :>> ", res);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return loading ? (
        <LoadingPage />
    ) : (
        <MainLayout>
            <div className={cx("mint-nft-detail")}>
                <div className={cx("breadcrums")}>
                    {" "}
                    <Breadcrumbs separator={<NavigateNextIcon />} aria-label="breadcrumb">
                        {pathnames.map((name, index) => {
                            if (index === 3) return;
                            let routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                            if (index === 1) {
                                routeTo = routeTo + `/${pathnames[2]}?view=true`;
                            }
                            return (
                                <span
                                    key={name}
                                    onClick={() => {
                                        if (index === 2) {
                                            return;
                                        }
                                        history.push(routeTo);
                                    }}
                                >
                                    {name}
                                </span>
                            );
                        })}
                    </Breadcrumbs>
                </div>
                <Row>
                    <Col span={10} className={cx("left")}>
                        <Button
                            className={cx("back")}
                            onClick={() =>
                                // history.push({
                                //     pathname: `/profile/manage-nft/${address}`,
                                //     state: { isMintNft: false },
                                // })
                                history.goBack()
                            }
                        >
                            <LeftOutlined />
                        </Button>
                        <div className={cx("image-box")}>
                            <img
                                src={
                                    nftInfo.imageUrl ||
                                    `https://images.kawaii.global/kawaii-marketplace-image/items/201103.png`
                                }
                                alt="icon"
                            />
                        </div>
                    </Col>

                    <Col offset={1} span={13} className={cx("right")}>
                        <div className={cx("title")}>
                            <span className={cx("first")}>{nftInfo?.name}</span>
                            <span className={cx("second")}>#{nftInfo?.tokenId}</span>
                        </div>
                        <div className={cx("third")}>{nftInfo?.category}</div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Supply:</span>
                            <span className={cx("value")}>{nftInfo?.supply}</span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Author:</span>
                            <span className={cx("value")}>{nftInfo?.author}</span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Description:</span>
                            <span className={cx("value")}>{nftInfo?.description}</span>
                        </div>
                        <div className={cx("content", "content-attribute")}>
                            <span className={cx("title")}>Attributes:</span>

                            {/* <span className={cx("value")}>{nftInfo?.description}</span> */}
                            <Grid container spacing={2}>
                                {nftInfo.attributes?.map((info, idx) => (
                                    <Grid item container xs={6} key={idx}>
                                        <Grid item xs={4}>
                                            <div className={cx("info-image")}>
                                                <img src={info.image}></img>
                                            </div>
                                        </Grid>
                                        <Grid item xs={8} className={cx("info-group")}>
                                            <div className={cx("info-group-header")}>{info.type}</div>
                                            <div className={cx("info-group-text")}>{info.value}</div>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default NFTDetail;
