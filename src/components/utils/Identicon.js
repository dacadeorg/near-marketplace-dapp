import React from "react";
import Identicon from "react-hooks-identicons";

const Identicons = ({ address }) => {
  return <Identicon string={address || "Helloworld"} />;
};

export default Identicons;
