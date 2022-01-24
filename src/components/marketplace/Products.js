import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import AddProduct from './AddProduct';
import Product from './Product';
import Loader from '../utils/Loader';
import { Row } from 'react-bootstrap';

import { NotificationSuccess, NotificationError } from '../utils/Notifications';
import { getProducts as getProductList, buyProduct, createProduct, getAccountId } from '../../utils/marketplace';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of products
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await getProductList());
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
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Street Food</h1>
            <AddProduct save={addProduct} />
          </div>
          <Row xs={1} sm={2} lg={3}  className="g-3  mb-5 g-xl-4 g-xxl-5">
            {products.map((_product) => (
              <Product
                product={{
                  ..._product,
                }}
                buy={buy}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Products;
