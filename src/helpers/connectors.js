import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const RPC_URL_56 = "https://bsc-dataseed4.defibit.io/";
const RPC_URL_97 = "https://data-seed-prebsc-2-s1.binance.org:8545/";

const POLLING_INTERVAL = 12000;
export const RPC_URLS = {
  56: process.env.REACT_APP_RPC_URL_56 || RPC_URL_56,
  97: process.env.REACT_APP_RPC_URL_97 || RPC_URL_97,
};
export const NETWORKS = {
  mainnet: 56,
  testnet: 97,
};

export const injected = new InjectedConnector({
  supportedChainIds: [NETWORKS["mainnet"], NETWORKS["testnet"]],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 56: RPC_URLS[56] },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
