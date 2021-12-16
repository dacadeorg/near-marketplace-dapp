import React from 'react';
import PropTypes, { string } from 'prop-types';
import { utils } from 'near-api-js';

const PurchasedProduct = ({purchase}) => {
    const {
        id, price, name, description, image
    } = purchase;
    return (
        <>
            <div className="card col-lg-4 col-md-6 col-xs-12 mb-4" key={id}>
                <img className="card-img-top" src={image} alt="..." />
                <div className="card-body text-left p-4 position-relative">
                    <h2 className="card-title fs-4 fw-bold mt-2">{name}</h2>
                    <p className="card-text mb-4" style={{ minHeight: '82px' }}>
                        {description}
                    </p>
                    <p className="card-text mt-4">
                        <i className="bi bi-currency-exchange" />
                        <span>{utils.format.formatNearAmount(price)}</span>
                    </p>
                </div>
            </div>
        </>
    );
};

PurchasedProduct.propTypes = {
    accountId: PropTypes.instanceOf(string).isRequired
};

export default PurchasedProduct;
