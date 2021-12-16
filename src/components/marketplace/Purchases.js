/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect, useCallback } from 'react';
import PurchasedProduct from './PurchasedProduct';
import { getPurchases as getPurchasedProducts } from '../../utils/marketplace';

const Purchases = ({ accountId }) => {

    console.log(accountId)

    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);

    const getPurchases = useCallback(async () => {
        try {
            setLoading(true);
            setPurchases(await getPurchasedProducts(accountId));
        } catch (error) {
            console.log({ error });
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        getPurchases();
    }, []);

    return (
        <>
            <main id="purchases" className="row">
                {purchases.map(purchase => (
                    <PurchasedProduct
                        purchase={{ ...purchase }}
                    />
                ))}
            </main>
        </>
    );
};

export default Purchases;
