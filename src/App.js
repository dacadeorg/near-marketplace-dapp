import './App.css';

import React from 'react';

import Address from './components/wallet/Address';
import Balance from './components/wallet/Balance';
import ConnectWallet from './components/wallet/ConnectWallet';
import Disconnect from './components/wallet/DisconnectWallet';

import { Notification } from './components/utils/Notifications';
import Products from './components/marketplace/Products';
import Cover from './components/marketplace/Cover';

const App = function AppWrapper() {
  const account = window.walletConnection.account();
  return (
    <>
      <Notification />
      <div className="container" style={{ maxWidth: '72em' }}>
        {
          account.accountId ? (
            <>
              <nav className="navbar bg-white navbar-light text-dark mt-2">
                <div className="container-fluid">
                  <Address address={account.accountId} />
                  <Balance symbol=" NEAR" />
                  <Disconnect />
                </div>
              </nav>
              <main>
                <Products />
              </main>

            </>
          ) : (
            <>
              <ConnectWallet />
              <main>
                <Cover name="Street Food Kigali" />
              </main>
            </>
          )
        }
      </div>
    </>
  );
};

export default App;
