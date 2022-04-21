import Web3 from "web3";
import { RPC_URLS } from "src/helpers/connectors";
import { splitSignature } from "@ethersproject/bytes";
import { BSC_CHAIN_ID_HEX, BSC_rpcUrls, BSC_blockExplorerUrls, BSC_CHAIN_ID } from "src/consts/blockchain";

export const createNetworkOrSwitch = async provider => {
    if (!provider.isMetaMask) {
        throw new Error(`Please change network to Binance smart chain`);
    }
    let ethereum = window.ethereum;

    if (!ethereum) throw new Error(`Please change network to Binance smart chain`);

    const chainId = BSC_CHAIN_ID_HEX;
    const data = [
        {
            chainId: BSC_CHAIN_ID_HEX,
            chainName: "Binance Smart Chain",
            nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
            },
            rpcUrls: [BSC_rpcUrls],
            blockExplorerUrls: [BSC_blockExplorerUrls],
        },
    ];

    try {
        await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
        });
        console.log(123);
    } catch (switchError) {
        console.log(switchError);
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: data,
                });
            } catch (addError) {
                console.log(addError);
            }
        } else {
            throw Error("Switch network fail!");
        }
    }
};

export const write = async (method, provider, address, abi, params, sendObj, callback) => {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);
    let response;
    await contract.methods[method](...params)
        .send(sendObj)
        .on("transactionHash", hash => {
            console.log("txhash", hash);
            if (callback) {
                callback(hash);
            }
        })
        .on("receipt", receipt => {
            console.log(receipt);
            response = receipt;
        });
    return response;
};

export const sign = async (account, data, provider) => {
    let res = await provider.send("eth_signTypedData_v4", [account, data]);
    if (res.result) {
        res = res.result;
    }
    return splitSignature(res);
};

export const read = async (method, chainId, address, abi, params) => {
    const web3 = new Web3(RPC_URLS[chainId]);
    const contract = new web3.eth.Contract(abi, address);
    const res = await contract.methods[method](...params).call();
    return res;
};

export const getCurrentBlock = () => {
    const web3 = new Web3(RPC_URLS[BSC_CHAIN_ID]);
    return web3.eth.getBlockNumber();
};
