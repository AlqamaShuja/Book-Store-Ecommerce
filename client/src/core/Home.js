import React, { useEffect, useState } from 'react';
import { getProducts } from './apiCore';
import Card from './Card';
import Layout from './Layout';
import Search from './Search';

 

const Home = () => {
    const [productBySell, setProductBySell] = useState([]);
    const [productByArrival, setProductByArrival] = useState([]);
    const [error, setError] = useState(false);

    const loadProductBySell = () => {
        getProducts('sold')
        .then(data => {
            if(data.error){
                setError(data.error);
            }
            else{
                setProductBySell(data);
            }
        })
        .catch(err => { setError(err) });
    }

    const loadProductByArrival = () => {
        getProducts('createdAt')
        .then(data => {
            if(data.error){
                setError(data.error);
            }
            else{
                setProductByArrival(data);
            }
        })
        .catch(err => { setError(err) });
    }

    const showErrorMessage = (err) => {
        if(err){
            return <h2>Something went wrong.</h2>
        }
    }

    //useEffect
    useEffect(() => {
        loadProductBySell();
        loadProductByArrival();
    }, [])

    return ( 
        <Layout title="Home page" description="Node React Ecommerce App" className="container-fluid">
            <Search />
            {showErrorMessage(error)}
            <h2 className="mb-4">Best Seller</h2>
            
            <div className="row">
                {productBySell.map((prod, i) => (
                    <div className="col-4 mb-3" key={i}>
                        <Card product={prod}  />
                    </div>    
                ))}
            </div>
            
            <h2 className="mb-4">New Arrival</h2>
            
            <div className="row">
                {productByArrival.map((prod, i) => (
                    <div className="col-4 mb-3" key={i}>
                        <Card product={prod} />
                    </div>
                ))}
            </div>
        </Layout>
     );
}
 
export default Home;