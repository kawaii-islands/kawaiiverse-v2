import React, { useEffect } from "react";
import cn from "classnames/bind";
import styles from "./FilterStore.module.scss";
import filter from "../../assets/icons/filter.svg";
import { Collapse } from "antd";
import logoKawaii from "../../assets/images/logo_kawaii.png";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
const { Panel } = Collapse;
const cx = cn.bind(styles);

const FilterStore = ({ gameList, setGameSelected, gameSelected }) => {
  const handleGameClick = (address, name) => {
    if (checkGameIfIsSelected(address) !== -1) {
      setGameSelected(gameSelected => {
        const copyGame = [...gameSelected];
        copyGame.splice(checkGameIfIsSelected(address), 1);
        return copyGame;
      });
    } else {
      setGameSelected(gameSelected => [...gameSelected, { gameAddress: address, gameName: name }]);
    }
    // let listGame = new Set(gameSelected);
    // listGame.add(address);  
    // listGame = [...listGame.values()];
    // setGameSelected([...listGame]);
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
        </Collapse>
      </div>
    </div>
  );
};

export default FilterStore;
