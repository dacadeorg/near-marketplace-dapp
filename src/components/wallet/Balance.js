import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { accountBalance } from '../../utils/marketplace'

const Balance = ({ symbol }) => {

  const [balance, setBalance] = useState("0");

  const getBalance = useCallback(async () => {
    setBalance(await accountBalance());
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  if (balance) {
    return (
      <div>
        <span id="balance">
          {balance}
        </span>
        <span className="">{symbol}</span>
      </div>
    );
  }

  return null;
};

Balance.propTypes = {
  symbol: PropTypes.string,
  amount: PropTypes.number,
};

Balance.defaultProps = {
  amount: 0,
  symbol: '',
};

export default Balance;
