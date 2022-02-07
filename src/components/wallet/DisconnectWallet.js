import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { logout as destroy } from '../../utils/near';

const DisconnectWallet = () => {
  const logout = () => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="custom-ui card m-2">
          <div className="card-body m-2">
            <h5 className="card-title">Disconnect</h5>
            <p className="card-text">Are you sure you want to disconnect your wallet?</p>
            <div className="d-flex justify-content-end ">
              <button type="button" className="btn fw-bold" onClick={onClose}>
                CANCEL
              </button>
              <button
                type="button"
                className="btn fw-bold"
                onClick={() => {
                  destroy();
                  onClose();
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ),
    });
  };
  return (
    <span role="button" tabIndex={0} className="border rounded-pill btn bg-light" onClick={logout}>
      <i className="bi bi-arrows-angle-expand" /> Logout
    </span>
  );
};

export default DisconnectWallet;
