import React, { useEffect, useState } from "react";
import styles from "./CreateGame.module.scss";
import Grid from "@mui/material/Grid";
import cn from "classnames/bind";
import { BSC_rpcUrls } from "src/consts/blockchain";
import logoKawaii from "../../../assets/images/logo_kawaii.png";
import logoTrend from "../../../assets/images/trend1.png";
import logoLayers from "../../../assets/images/layers1.png";
import logoCreate from "../../../assets/images/add.png";
import addImage from "../../../assets/images/add-img.png";
import logoSuccess from "../../../assets/images/success.png";
import Web3 from "web3";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const CreateGame = () => {
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [gameInfo, setgameInfo] = useState({});
    const [errorSymbol, setErrorSymbol] = useState(false);
    const [errorImage, setErrorImage] = useState(false);
    const [fileName, setFileName] = useState();
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSuccess(false);
        setErrorName(false);
        setErrorSymbol(false);
        setErrorImage(false);
        setFileName();
    };

    const inputChangeHandler = (key, value) => {
        setgameInfo({ ...gameInfo, [key]: value });
    };

    const handleChangeName = e => {
        e.target.value ? setErrorName(false) : setErrorName(true);
        inputChangeHandler("name", e.target.value);
    };

    const handleChangeSymbol = e => {
        e.target.value ? setErrorSymbol(false) : setErrorSymbol(true);
        inputChangeHandler("symbol", e.target.value);
    };

    const handleUploadImage = e => {
        e.target.files[0] ? setErrorImage(false) : setErrorImage(true);
        setFileName(e.target.files[0].name);
        inputChangeHandler("avatar", e.target.files[0]);
    };

    const handleCreate = () => {
        console.log(checkValidation());
        checkValidation() == 1 ? setSuccess(true) : setSuccess(false);
        // setSuccess(true);
    };

    const checkValidation = () => {
        console.log(gameInfo);
        !gameInfo.name ? setErrorName(true) : setErrorName(false);
        !gameInfo.symbol ? setErrorSymbol(true) : setErrorSymbol(false);
        !gameInfo.avatar ? setErrorImage(true) : setErrorImage(false);
        if (!gameInfo.name || !gameInfo.symbol || !gameInfo.avatar) return 0;
        else return 1;
    };

    return (
        <div className={cx("container")}>
            <div className={cx("content")}>
                <Grid container spacing={2} className={cx("grid-parent")}>
                    <Grid item md={4} sm={6} xs={12}>
                        <Card className={cx("create-card", "card")} onClick={handleOpen}>
                            <CardContent>
                                <Typography className={cx("create-header")}>
                                    <img src={logoCreate} alt="logo" className={cx("create-logo")} />
                                </Typography>

                                <Typography className={cx("create-paragraph")}>CREATE GAME</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                        <Card className={cx("item-card", "card")}>
                            <CardContent>
                                <Typography className={cx("item-header")}>
                                    <img src={logoKawaii} alt="logo" className={cx("game-logo")} />
                                    Kawaii Islands
                                </Typography>
                                <Typography className={cx("item-paragraph")}>
                                    <img src={logoLayers} alt="logo" className={cx("game-mini")} />
                                    Items: <span className={cx("game-amount")}>100</span>
                                </Typography>
                                <Typography className={cx("item-paragraph")}>
                                    <img src={logoTrend} alt="logo" className={cx("game-mini")} />
                                    Total sale: <span className={cx("game-amount")}>1,000,000 KWT</span>
                                </Typography>
                            </CardContent>
                            <CardActions className={cx("create-action")}>
                                <Button size="small" className={cx("create-button")}>
                                    Join now
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                        <Card className={cx("item-card", "card")}>
                            <CardContent>
                                <Typography className={cx("item-header")}>
                                    <img src={logoKawaii} alt="logo" className={cx("game-logo")} />
                                    Kawaii Islands
                                </Typography>
                                <Typography className={cx("item-paragraph")}>
                                    <img src={logoLayers} alt="logo" className={cx("game-mini")} />
                                    Items: <span className={cx("game-amount")}>100</span>
                                </Typography>
                                <Typography className={cx("item-paragraph")}>
                                    <img src={logoTrend} alt="logo" className={cx("game-mini")} />
                                    Total sale: <span className={cx("game-amount")}>1,000,000 KWT</span>
                                </Typography>
                            </CardContent>
                            <CardActions className={cx("create-action")}>
                                <Button size="small" className={cx("create-button")}>
                                    Join now
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                        <Card className={cx("item-card", "card")}>
                            <CardContent>
                                <Typography className={cx("item-header")}>
                                    <img src={logoKawaii} alt="logo" className={cx("game-logo")} />
                                    Kawaii Islands
                                </Typography>
                                <Typography className={cx("item-paragraph")}>
                                    <img src={logoLayers} alt="logo" className={cx("game-mini")} />
                                    Items: <span className={cx("game-amount")}>100</span>
                                </Typography>
                                <Typography className={cx("item-paragraph")}>
                                    <img src={logoTrend} alt="logo" className={cx("game-mini")} />
                                    Total sale: <span className={cx("game-amount")}>1,000,000 KWT</span>
                                </Typography>
                            </CardContent>
                            <CardActions className={cx("create-action")}>
                                <Button size="small" className={cx("create-button")}>
                                    Join now
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                        <Card className={cx("item-card", "card")}>
                            <CardContent>
                                <Typography className={cx("item-header")}>
                                    <img src={logoKawaii} alt="logo" className={cx("game-logo")} />
                                    Kawaii Islands
                                </Typography>
                                <Typography className={cx("item-paragraph")}>
                                    <img src={logoLayers} alt="logo" className={cx("game-mini")} />
                                    Items: <span className={cx("game-amount")}>100</span>
                                </Typography>
                                <Typography className={cx("item-paragraph")}>
                                    <img src={logoTrend} alt="logo" className={cx("game-mini")} />
                                    Total sale: <span className={cx("game-amount")}>1,000,000 KWT</span>
                                </Typography>
                            </CardContent>
                            <CardActions className={cx("create-action")}>
                                <Button size="small" className={cx("create-button")}>
                                    Join now
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
                <Modal open={open} onClose={handleClose}>
                    <div className={cx("modal-style")}>
                        {console.log(success)}
                        {success == false ? (
                            <>
                                <Typography className={cx("modal_header")}>CREATE GAME</Typography>
                                <input
                                    placeholder="&nbsp;&nbsp;Name"
                                    className={errorName == false ? cx("input") : cx("input_error")}
                                    required
                                    onChange={handleChangeName}
                                />
                                {errorName == true ? (
                                    <div className={cx("error_tag")}>
                                        <p className={cx("error_tag_text")}>This field should not be empty!</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <input
                                    placeholder="&nbsp;&nbsp;Symbol"
                                    className={errorSymbol == false ? cx("input") : cx("input_error")}
                                    required
                                    onChange={handleChangeSymbol}
                                />
                                {errorSymbol == true ? (
                                    <div className={cx("error_tag")}>
                                        <p className={cx("error_tag_text")}>This field should not be empty!</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <div className={cx("input_container")}>
                                    <input
                                        placeholder="&nbsp;&nbsp;Avatar"
                                        value={fileName}
                                        className={errorImage == false ? cx("input") : cx("input_error")}
                                        readOnly
                                        // onChange={handleChangeImage}
                                    />
                                    <label htmlFor="file-input">
                                        <img src={addImage} alt="upload-img" className={cx("input_img")} />
                                    </label>
                                    <input
                                        placeholder="String"
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={e => handleUploadImage(e)}
                                    />
                                    {errorImage == true ? (
                                        <div className={cx("error_tag")}>
                                            <p className={cx("error_tag_text")}>This field should not be empty!</p>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                <Button className={cx("modal_create")} onClick={handleCreate}>
                                    Create now
                                </Button>
                            </>
                        ) : (
                            <div className={cx("modal_success")}>
                                <img src={logoSuccess} alt="logo" className={cx("success_logo")} />
                                <p className={cx("modal_text")}>SUCCESSFUL</p>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default CreateGame;
