import './App.css';

import React, { useEffect, useCallback, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import { Container, Nav, Button, Alert } from "react-bootstrap";
import Wallet from "./components/wallet/Wallet";
import { Notification } from './components/utils/Notifications';
import Products from './components/marketplace/Products';
import coverImg from "./assets/img/sandwich.jpg"
import { login, logout as destroy, accountBalance } from './utils/contract';

const App = function AppWrapper() {
  const account = window.walletConnection.account();

  const [balance, setBalance] = useState("0");

  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const triggerConnection = async () => {
    try {
      await login();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Notification />
      <Container fluid="md">
        {
          account.accountId ? (
            <>
              <Nav className="justify-content-end pt-3 pb-5">
                <Nav.Item>
                  <Wallet address={account.accountId} amount={balance} symbol="NEAR" destroy={destroy} />
                </Nav.Item>
              </Nav>
              <main>
                <Products />
              </main>
            </>
          ) : (

            <>
              <div className="d-flex justify-content-center flex-column text-center " style={{ background: "#000", minHeight: "100vh" }}>
                <div className="mt-auto text-light mb-5">
                  <div className=" ratio ratio-1x1 mx-auto mb-2" style={{ maxWidth: "320px" }}>
                    <img src={coverImg} alt="" />
                  </div>
                  <h1>Street Food Kigali</h1>
                  <p>
                    Please connect your wallet to continue.
                  </p>
                  <Button onClick={login} variant="outline-light" className="rounded-pill px-3 mt-3">
                    Connect Wallet
                  </Button>
                </div>
                <p className="mt-auto text-secondary">Powered by NEAR</p>
              </div>
            </>
          )
        }
      </Container>
    </>
  );
};

export default App;
