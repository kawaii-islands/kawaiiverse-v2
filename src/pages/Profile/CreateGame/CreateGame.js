import React, { useEffect, useState } from "react";
import styles from "./CreateGame.module.scss";
import cn from "classnames/bind";
import { read, createNetworkOrSwitch, write } from "src/services/web3";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
import { toast } from "react-toastify";
import { Col, Row, Spin, Modal } from "antd";
import Web3 from "web3";
import plusIcon from "src/assets/icons/plus.svg";
import { useWeb3React } from "@web3-react/core";
import trashIcon from "src/assets/icons/coolicon.svg";
import { Button } from "@mui/material";
import RELAY_ABI from "src/utils/abi/relay.json";
import { RELAY_ADDRESS, KAWAIIVERSE_NFT1155_ADDRESS, FACTORY_ADDRESS } from "src/consts/address";
import { Close } from "@mui/icons-material";
import MainLayout from "src/components/MainLayout";
import logoKawaii from "src/assets/images/logo_kawaii.png";
import Item from "./Item";
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const CreateGame = ({ gameList, setGameSelected, gameSelected, logInfo }) => {
  const [open, setOpen] = React.useState(false);

  const { account, chainId, library } = useWeb3React();
  const [loading, setLoading] = useState(false);

  const [gameInfo, setgameInfo] = useState("");
  const [rowItem, setRowItem] = useState(0);
	const [listToken, setListToken] = useState([]);

  const inputChangeHandler = (key, value) => {
    setgameInfo({ ...gameInfo, [key]: value });
  };
  const handleGameClick = (address, idx) => {
    console.log(address);
    setGameSelected(address);
    setOpen(true);
  };
  const createGame = async () => {
    if (!gameInfo?.name || !gameInfo?.symbol) return;
    setLoading(true);

    const _data = web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "_imp",
            type: "address",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_symbol",
            type: "string",
          },
        ],
        name: "createNFT1155",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      [account, KAWAIIVERSE_NFT1155_ADDRESS, gameInfo.name, gameInfo.symbol],
    );

    try {
      if (chainId !== BSC_CHAIN_ID) {
        console.log("BSC_CHAIN_ID :>> ", BSC_CHAIN_ID);
        console.log("chainId :>> ", chainId);
        const error = await createNetworkOrSwitch(library.provider);
        if (error) {
          throw new Error("Please change network to Testnet Binance smart chain.");
        }
      }
      await write(
        "execute",
        library.provider,
        RELAY_ADDRESS,
        RELAY_ABI,
        [FACTORY_ADDRESS, _data],
        { from: account },
        hash => {
          console.log(hash);
        },
      );
      setLoading(false);
      logInfo();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message || "An error occurred!");
    }
  };
	const createToken = () => {
		console.log(listToken)
	}
  return (
    <div className={cx("container")}>
      <div className={cx("form")}>
        <div className={cx("form-input")}>
          <div className={cx("form-item")}>
            <div className={cx("label")}>Name</div>
            <input
              placeholder="String..."
              value={gameInfo.name}
              className={cx("input")}
              required
              onChange={e => inputChangeHandler("name", e.target.value)}
            />
          </div>
          <div className={cx("form-item")}>
            <div className={cx("label")}>Symbol</div>
            <input
              placeholder="String..."
              value={gameInfo.symbol}
              className={cx("input")}
              required
              onChange={e => inputChangeHandler("symbol", e.target.value)}
            />
          </div>
        </div>
        <div className={cx("btn-wrapper")}>
          <Button className={cx("confirm-btn")} onClick={createGame}>
            {loading ? <Spin style={{ color: "white" }} /> : "CONFIRM"}
          </Button>
        </div>
      </div>
      <div className={cx("divider")}></div>
      <div className={cx("name-title")}>My game</div>
      {gameList?.map((gameName, idx) => (
        <div
          className={gameName.gameAddress == gameSelected ? cx("name-selected") : cx("name")}
          key={idx}
          onClick={() => handleGameClick(gameName.gameAddress, idx)}
        >
          <img src={logoKawaii} className={cx("name-avatar")} />
          <span className={gameName.gameAddress == gameSelected ? cx("name-selected-text") : cx("name-text")}>
            {gameName.gameName}
          </span>
        </div>
      ))}
      <Modal
        className={cx("modal")}
        visible={open}
        footer={null}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <div className={cx("modal-content")}>
          <Row>
            <Col className={cx("modal-act")}>Create ID</Col>
            <Col className={cx("modal-act-btn")} onClick={() => setRowItem(rowItem + 1)}>
              +
            </Col>
          </Row>
          <Row className={cx("modal-table-header")}>
            <Col span={10}>Token ID</Col>
            <Col span={10}>Supply</Col>
            <Col span={3}></Col>
          </Row>
          <div className={cx("modal-table-content")}>
            {new Array(rowItem).fill().map((i,idx) => (
              <Item 
							rowItem={rowItem}
              idx={idx}
							listToken={listToken} 
							setListToken={setListToken} key={`token-item-${idx}`}/>
            ))}
          </div>
          <div className={cx("modal-footer")}>
            <Button className={cx("modal-footer-btn")} onClick={createToken}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateGame;
