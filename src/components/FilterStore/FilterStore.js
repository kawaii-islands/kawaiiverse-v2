import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import styles from "./FilterStore.module.scss";
import filter from "../../assets/icons/filter.svg";
import { Collapse } from "antd";
import logoKawaii from "../../assets/images/logo_kawaii.png";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
const { Panel } = Collapse;
const cx = cn.bind(styles);

const FilterStore = ({ gameList, setGameSelected, gameSelected }) => {
    const [openListGame, setOpenListGame] = useState(true);

    const handleGameClick = (address, name, logoUrl) => {
        if (checkGameIfIsSelected(address) !== -1) {
            setGameSelected(gameSelected => {
                const copyGame = [...gameSelected];
                copyGame.splice(checkGameIfIsSelected(address), 1);
                return copyGame;
            });
        } else {
            setGameSelected(gameSelected => [
                ...gameSelected,
                { gameAddress: address, gameName: name, logoUrl: logoUrl },
            ]);
        }
    };
    const checkGameIfIsSelected = address => {
        let count = -1;
        gameSelected.map((game, idx) => {
            if (game.gameAddress === address) {
                count = idx;
            }
        });
        return count;
    };
    return (
        <div className={cx("filter")}>
            <div className={cx("card-header")}>
                <img src={filter} alt="filter" />
                <span className={cx("title")}>Filter</span>
            </div>
            <div className={cx("collapse")}>
                <div className={cx("panel")}>
                    <div className={cx("panel-header")}>
                        <span>Game</span>
                        <KeyboardArrowDownRoundedIcon
                            style={{ fontSize: "28px" }}
                            onClick={() => setOpenListGame(!openListGame)}
                        />
                    </div>
                    {openListGame && (
                        <div className={cx("panel-content")}>
                            {gameList?.map((gameName, idx) => {
                                let condition = false;
                                gameSelected.map(game => {
                                    if (game.gameAddress === gameName.gameAddress) {
                                        condition = true;
                                    }
                                });
                                return (
                                    <div
                                        // className={cx("game-name", condition && "game-active")}
                                        className={cx("game-name")}
                                        key={idx}
                                        onClick={() =>
                                            handleGameClick(gameName.gameAddress, gameName.gameName, gameName.logoUrl)
                                        }
                                    >
                                        <Checkbox
                                            type="checkbox"
                                            checked={condition}
                                            sx={{
                                                color: "#E7DFFF",
                                                "&.Mui-checked": {
                                                    color: "#bcabea"
                                                },
                                            }}
                                        />
                                        <img
                                            src={gameName.logoUrl || logoKawaii}
                                            className={cx("game-avatar")}
                                            alt=""
                                        />
                                        <span>{gameName.gameName}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {/* <Collapse
          defaultActiveKey={["1"]}
          expandIconPosition="right"
          bordered={false}
          className="site-collapse-custom-collapse"
        >
          <Panel header="Game" key="1" className="site-collapse-custom-panel">
            <div className={cx("panel-content")}>
              {gameList?.map((gameName, idx) => (
                <div
                  className={gameName.gameAddress === gameSelected ? cx("name-selected") : cx("name")}
                  key={idx}
                  onClick={() => handleGameClick(gameName.gameAddress, gameName.gameName)}
                >
                  <img src={logoKawaii} className={cx("name-avatar")} alt="" />
                  <span className={gameName.gameAddress === gameSelected ? cx("name-selected-text") : cx("name-text")}>
                    {gameName.gameName}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </Collapse> */}
            </div>
        </div>
    );
};

export default FilterStore;
