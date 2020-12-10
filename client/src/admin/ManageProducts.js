import React, { useEffect, useState } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth/index';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from './apiAdmin';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const { user, token } = isAuthenticated();

    const destroy = (prodId) => {
        deleteProduct(prodId, user._id, token).then(data => {
            if(data.error){
                console.log("Error at ManageProduct: ", data.error);
            }
            else{
                loadProducts();
            }
        }).catch(err => {
            console.log("Error at ManageProduct: ", err);
        });
    }

    const loadProducts = () => {
        getProducts().then(data => {
            if(data.error){
                console.log("Error at ManageProduct: ", data.error);
            }
            else{
                setProducts(data);
            }
        }).catch(err => {
            console.log("Error at ManageProduct: ", err);
        });
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return ( 
        <Layout title="Manage Products" description="Perform CRUD on Products" className="container-fluid">
            {/* <h2 className="mb-4">Manage Products</h2> */}
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center"> Total {products.length} Products </h2>
                    <hr />
                    <ul className="list-group container col-10">
                        {products.map((p, pIndex) => (
                            <li key={pIndex} className="list-group-item d-flex justify-content-between align-items-center">
                                <strong className="col-8">{p.name}</strong>
                                <Link to={`/admin/product/update/${p._id}`}>
                                    <span  className="badge badge-warning badge-pill"> Update </span>
                                </Link>
                                <Link>
                                    <span onClick={() => destroy(p._id)} className="badge badge-danger badge-pill"> delete </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
     );
}
 
export default ManageProducts;