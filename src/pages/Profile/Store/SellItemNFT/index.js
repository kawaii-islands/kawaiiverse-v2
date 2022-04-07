import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import cn from "classnames/bind";
import styles from "./index.module.scss";
import { Col, Row } from "antd";
import { toast } from "react-toastify";
import Item from "./Item";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { read, sign, write, createNetworkOrSwitch } from "src/services/web3";
import { KAWAIIVERSE_STORE_ADDRESS, RELAY_ADDRESS } from "src/consts/address";
import KAWAIIVERSE_NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import RELAY_ABI from "src/utils/abi/relay.json";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
import 'react-toastify/dist/ReactToastify.css';
import addRowItem from "src/assets/icons/addRowItem.svg";
import LoadingModal from "src/components/LoadingModal/LoadingModal";
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const SellItemNFT = ({ gameSelected,setIsSellNFT }) => {
  const [list, setList] = useState([]);
  const [rowItem, setRowItem] = useState(1);
  const [canAdd, setCanAdd] = useState(false);
  const [listSell, setListSell] = useState([]);
  const [error, setError] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { account, library, chainId } = useWeb3React();
  const [isApprovedForAll, setIsApprovedForAll] = useState(false);
  useEffect(() => {
    getListNft();
    getAllowance();
  }, [gameSelected,account]);

  const getListNft = async () => {
    try {
      const res = await axios.get(`http://159.223.81.170:3000/v1/nft/${gameSelected}`);
      if (res.status === 200) {
        // console.log(res.data.data);
        
        setList(res.data.data);
      } else {
        toast.error("Cannot get list Nft");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getAllowance = async () => {
    if(!account) return;
    const isApprovedForAll = await read("isApprovedForAll", BSC_CHAIN_ID, gameSelected, KAWAIIVERSE_NFT1155_ABI, [
      account,
      KAWAIIVERSE_STORE_ADDRESS,
    ]);
    setIsApprovedForAll(isApprovedForAll);
  };

  const addItem = () => {
    if(!canAdd) return;
    setRowItem(rowItem + 1);
    setCanAdd(false);
  };

  const createItem = async () => {
    try {
      await write("createItem", library.provider, gameSelected, KAWAIIVERSE_NFT1155_ABI, [account, 123, 30], {
        from: account,
      });
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const sellNft = async () => {
    console.log(listSell);
    if(listSell?.length === 0) return;
    setSubmitted(true);
    let pass = true;
    listSell.forEach((item) => {
      if(item.price <= 0 || item.quantity <= 0 ) pass = false;
    })
    if(!pass){
      return;
    }
    try{
      setLoadingTx(true);
      if (chainId !== BSC_CHAIN_ID) {
        const error = await createNetworkOrSwitch(library.provider);
        console.log(error);
        if (error) {
            toast.error(error);
            throw new Error("Please change network to Testnet Binance smart chain.");
            
        }
    }
      if (!isApprovedForAll) {
        
          await write(
            "setApprovalForAll",
            library.provider,
            gameSelected,
            KAWAIIVERSE_NFT1155_ABI,
            [KAWAIIVERSE_STORE_ADDRESS, true],
            {
              from: account,
            },
          );
       
      }
  
      const { r, s, v } = await getSignature();
      
      // if (listSell.length === 1) {
        console.log("1:" + gameSelected);
        const _data = web3.eth.abi.encodeFunctionCall(
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "address",
                name: "_nftAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_price",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
            ],
            name: "saleNFT1155",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          [
            account,
            gameSelected,
            listSell[0].tokenId,
            listSell[0].quantity,
            web3.utils.toWei(listSell[0].price),
            v,
            r,
            s,
          ],
        );
        console.log(
          account,
          gameSelected,
          listSell[0].tokenId,
          listSell[0].quantity,
          web3.utils.toWei(listSell[0].price),
          v,
          r,
          s,
        );
  
        await write(
          "execute",
          library.provider,
          RELAY_ADDRESS,
          RELAY_ABI,
          [KAWAIIVERSE_STORE_ADDRESS, _data],
          { from: account },
          hash => {
            console.log(hash);
          },
        );
        setLoadingTx(false);
        setIsSellNFT(false);
      // }
    }catch(err){
      console.log(err);
      setLoadingTx(false);
      toast.error(err);
    }
    
  };
  const getSignature = async () => {
    try{
      const nonce = await read("nonces", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [account]);
      const name = await read("NAME", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, []);
      const EIP712Domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ];
  
      const domain = {
        name,
        version: "1",
        chainId: BSC_CHAIN_ID,
        verifyingContract: KAWAIIVERSE_STORE_ADDRESS,
      };
  
      const Data = [
        { name: "sender", type: "address" },
        { name: "_nftAddress", type: "address" },
        { name: "nonce", type: "uint256" },
      ];
  
      const message = {
        sender: account,
        _nftAddress: gameSelected,
        nonce,
      };
  
      const data = JSON.stringify({
        types: {
          EIP712Domain,
          Data,
        },
        domain,
        primaryType: "Data",
        message,
      });
  
      const signature = await sign(account, data, library.provider);
      return signature;
    }catch(err){
      console.log(err);
    }
    
  };

  return (
    <div className={cx("table")}>
      <LoadingModal open={loadingTx}/>
      <Row className={cx("table-header")}>
        <Col span={4} style={{ textAlign: "center" }}>
          Token ID
        </Col>
        <Col span={4} style={{ textAlign: "center" }}>
          Name
        </Col>
        
        <Col span={4} style={{ textAlign: "center" }}>KWT/NFT</Col>
        <Col span={4} style={{ textAlign: "center" }}>Quantity</Col>
        <Col span={4} style={{ textAlign: "center" }}>Supply</Col>
        <Col span={4} style={{ textAlign: "center" }}>
        {/* <input type="checkbox" /> */}
        </Col>
      </Row>
      <div className={cx("table-body")}>
        {new Array(rowItem).fill().map((i,idx) => (
          <Item 
          setCanAdd={setCanAdd}
          setRowItem={setRowItem}
          rowItem={rowItem}
          addItem={addItem}
          submitted={submitted}
          setSubmitted={setSubmitted}
          list={list} listSell={listSell} setListSell={setListSell} key={`row-item-${idx}`}/>
        ))}
        <img src={addRowItem} alt="add-icon" className={cx("add-icon")} onClick={addItem} />

      </div>
      <div className={cx("wrapper-btn")}>
        <Button className={cx("wrapper-btn--sell")} onClick={sellNft}>
          SELL NFT
        </Button>
        
      </div>
    </div>
  );
};

export default SellItemNFT;
