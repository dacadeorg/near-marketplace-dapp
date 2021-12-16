import React from 'react';
import PropTypes from 'prop-types';
// import { truncateAddress } from '../../utils/utils';

const Address = ({ address }) => {
  if (address) {
    return <span className="border rounded-pill btn bg-light">{address}</span>;
  }

  return null;
};

Address.propTypes = {
  address: PropTypes.string,
};

Address.defaultProps = {
  address: '',
};

export default Address;
