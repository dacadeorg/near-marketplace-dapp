import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import AddProduct from './AddProduct';
import Product from './Product';
import Loader from '../utils/Loader';
import Purchases from './Purchases';

import { NotificationSuccess, NotificationError } from '../utils/Notifications';
import { getProducts as getProductList, buyProduct, createProduct, getAccountId } from '../../utils/marketplace';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState("");

  // function to get the list of products from the celo blockchain
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await getProductList());
      setAccountId(await getAccountId());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addProduct = async (data) => {
    try {
      setLoading(true);
      createProduct(data).then(resp => {
        getProducts();
      });
      toast(<NotificationSuccess text="Product added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a product." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to initiate transaction
  const buy = async (id, price) => {
    try {
      await buyProduct({
        id,
        price
      }).then(resp => getProducts());
      toast(<NotificationSuccess text="Product bought successfully" />);
    } catch (error) {
      toast(<NotificationError text="Failed to purchase product." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <div className="mb-4" style={{ marginTop: '4em' }}>
        <span
          className="btn btn-dark rounded-pill"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          Add product
        </span>
      </div>
      <main id="marketplace" className="row">
        {!loading ? (
          <>
            <AddProduct save={addProduct} />
            <h1>Available products</h1>
            <br />
            {products.map((_product) => (
              <Product
                product={{
                  ..._product,
                }}
                buy={buy}
              />
            ))}
            <br />
            <h1>Purchased products</h1>
            <Purchases accountId={accountId} />
          </>
        ) : (
          <Loader />
        )}
      </main>
    </>
  );
};

export default Products;
