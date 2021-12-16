import React from 'react';
import PropTypes from 'prop-types';
import { Button } from "react-bootstrap";

const Address = ({ address }) => {
  if (address) {
    return (
      <Button variant="outline-secondary" className="rounded-pill">{address}</Button>
    );
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
