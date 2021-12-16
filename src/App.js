import './App.css';

import React, { useEffect, useCallback, useState } from 'react';

import 'react-toastify/dist/ReactToastify.min.css';
import { Container, Nav, Button, Alert } from "react-bootstrap";

import Wallet from "./components/wallet/Wallet";
import { Notification } from './components/utils/Notifications';
import Products from './components/marketplace/Products';

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
      <Container style={{ maxWidth: "400px" }}>
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
              <div className="d-flex justify-content-center flex-column text-center vh-100">
                <Alert variant="warning" className="mt-auto">
                  <Alert.Heading>Street Food Kigali</Alert.Heading>
                  <p>
                    Please connect your wallet to continue.
                  </p>
                  <div className="d-flex justify-content-center mt-5">
                    <Button onClick={triggerConnection} variant="warning" className="rounded-pill px-3">
                      Connect Wallet
                    </Button>
                  </div>
                </Alert>
                <p className="mt-auto">Powered by NEAR</p>
              </div>
            </>
          )
        }
      </Container>
    </>
  );
};

export default App;
