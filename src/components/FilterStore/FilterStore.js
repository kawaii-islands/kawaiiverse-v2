import React, { useEffect } from "react";
import cn from "classnames/bind";
import styles from "./FilterStore.module.scss";
import filter from "../../assets/icons/filter.svg";
import { Collapse } from "antd";
import logoKawaii from "../../assets/images/logo_kawaii.png";
import { Button } from "@mui/material";

const { Panel } = Collapse;
const cx = cn.bind(styles);

const FilterStore = ({ gameList, setGameSelected, gameSelected, checkGameIfIsSelected }) => {
  const handleGameClick = (address, name) => {
    if (checkGameIfIsSelected(address) != -1) {
      setGameSelected(gameSelected => {
        const copyGame = [...gameSelected];
        copyGame.splice(checkGameIfIsSelected(address), 1);
        return copyGame;
      });
    } else {
      setGameSelected(gameSelected => [...gameSelected, { gameAddress: address, gameName: name }]);
    }
  };

  return (
    <div className={cx("filter")}>
      <div className={cx("card-header")}>
        <img src={filter} alt="filter" />
        <span className={cx("title")}>Filter</span>
      </div>
      <div className={cx("collapse")}>
        <Collapse
          defaultActiveKey={["1"]}
          expandIconPosition="right"
          bordered={false}
          className="site-collapse-custom-collapse"
        >
          <Panel header="Game" key="1" className="site-collapse-custom-panel">
            <div className={cx("panel-content")}>
              {gameList?.map((gameName, idx) => (
                <div
                  className={gameName.gameAddress == gameSelected ? cx("name-selected") : cx("name")}
                  key={idx}
                  onClick={() => handleGameClick(gameName.gameAddress, gameName.gameName)}
                >
                  <img src={logoKawaii} className={cx("name-avatar")} />
                  <span className={gameName.gameAddress == gameSelected ? cx("name-selected-text") : cx("name-text")}>
                    {gameName.gameName}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel header="Type" key="2" className="site-collapse-custom-panel"></Panel>
          <Panel header="Amount" key="3" className="site-collapse-custom-panel"></Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default FilterStore;
