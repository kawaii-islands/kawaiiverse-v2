import { injected, walletconnect } from "src/helpers/connectors";

export const ConnectorNames = {
  MetaMask: "MetaMask",
  WalletConnect: "WalletConnect",
};

export const connectorsByName = {
  [ConnectorNames.MetaMask]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
};
