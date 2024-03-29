import React, { Suspense } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { light } from "src/themes/light";
import "./App.css";
import "antd/dist/antd.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { CacheSwitch } from "react-router-cache-route";

import Header from "src/components/Header/index";
import LoadingPage from "./components/LoadingPage/LoadingPage";
import Messages from "./components/Messages";
import CreateGame from "./pages/Profile/CreateGame/CreateGame";

const Home = React.lazy(() => import("src/pages/Home/index.js"));
const Store = React.lazy(() => import("src/pages/Store/index.js"));
const NFTDetail = React.lazy(() => import("src/pages/Store/NFTDetail/index.js"));
const Profile = React.lazy(() => import("src/pages/Profile/index"));
const MintNFTDetail = React.lazy(() => import("src/pages/Profile/ManageNft/NFTDetail/NFTDetail"));
const SellNFTDetail = React.lazy(() => import("src/pages/Profile/Store/NFTDetail/NFTDetail"));

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={light}>
                <CssBaseline />
                <Messages />
                
                <ToastContainer />
                <Router>
                    <Header />
                    <CacheSwitch>
                        <Suspense fallback={<LoadingPage />}>
                            <Route exact path="/" component={props => <Home {...props} />} />
                            <Route exact path="/store" component={props => <Store {...props} />} />
                            <Route
                                path="/store/:storeAddress/:tokenId/:index"
                                component={props => <NFTDetail {...props} />}
                            />
                            <Route exact path="/profile" component={props => <CreateGame {...props} />} />
                            {/* <Route exact path="/profile/create-game" component={props => <CreateGame {...props} />} /> */}
                            <Route exact path="/profile/:tab/:address" component={props => <Profile {...props} />} />
                            <Route
                                exact
                                path="/profile/manage-nft/view-nft/:address/:nftId"
                                component={props => <MintNFTDetail {...props} />}
                            />
                            <Route
                                exact
                                path="/profile/store/view-nft/:address/:nftId/:tokenId/:index"
                                component={props => <SellNFTDetail {...props} />}
                            />
                        </Suspense>
                    </CacheSwitch>
                </Router>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
