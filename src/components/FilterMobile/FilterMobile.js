import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import styles from "./FilterMobile.module.scss";
import filter from "../../assets/icons/filter.svg";
import { Collapse } from "antd";
import logoKawaii from "../../assets/images/logo_kawaii.png";

const { Panel } = Collapse;
const cx = cn.bind(styles);

const FilterMobile = ({ setOpenFilterModal, setIsGameTab, gameList, setGameSelected, gameSelected }) => {
  const handleGameClick = address => {
    console.log(address);
    setGameSelected(address);
  };

  return (
    <div className={cx("filter")}>
      <div className={cx("close-modal")} onClick={() => setOpenFilterModal(false)}>
        &times;
      </div>
      <div className={cx("collapse")}>
        <Collapse
          defaultActiveKey={["1"]}
          expandIconPosition="right"
          bordered={false}
          className="site-collapse-custom-collapse"
        >
          <Panel header="Games" key="1" className="site-collapse-custom-panel">
            <div className={cx("panel-content")}>
              <div className={cx("name")}>
                <img src={logoKawaii} className={cx("name-avatar")} />
                <span className={cx("name-text")}>Kawaii island</span>
              </div>
              <div className={cx("name")}>
                <img src={logoKawaii} className={cx("name-avatar")} />
                <span className={cx("name-text")}>Kawaii island</span>
              </div>
            </div>
          </Panel>
          <Panel header="Game" key="2" className="site-collapse-custom-panel">
            {console.log(gameList)}
            <div className={cx("panel-content")}>
              {gameList?.map((gameName, idx) => (
                <div
                  className={gameName.gameAddress == gameSelected ? cx("name-selected") : cx("name")}
                  key={idx}
                  onClick={() => handleGameClick(gameName.gameAddress)}
                >
                  <img src={logoKawaii} className={cx("name-avatar")} />
                  <span className={gameName.gameAddress == gameSelected ? cx("name-selected-text") : cx("name-text")}>
                    {gameName.gameName}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <div className="site-collapse-custom-panel" onClick={() => setIsGameTab(true)}>
            <div className={cx("panel-content-game")}>Create Game</div>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default FilterMobile;
