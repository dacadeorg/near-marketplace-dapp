import React from 'react';
import { login } from '../../utils/marketplace'

const ConnectWallet = () => {
  const triggerConnection = async () => {
    try {
      await login();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="d-flex justify-content-end mt-3">
      <span
        role="button"
        tabIndex="0"
        className="btn border rounded-pill bg-light"
        onClick={triggerConnection}
      >
        <i className="bi bi-arrows-angle-contract m-1" />
        <span className="m-1">Connect Wallet</span>
      </span>
    </div>
  );
};

export default ConnectWallet;
