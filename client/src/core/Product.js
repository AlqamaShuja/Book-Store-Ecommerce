import React, { useEffect, useState } from 'react';
import { read, listRelated } from './apiCore';
import Card from './Card';
import Layout from './Layout';

const Product = (props) => {
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState(false);

    const loadSingleProduct = (productId) => {
        read(productId).then(data => {
            if(data.error){
                setError(data.error);
            }
            else{
                setProduct(data);
                //fetch related product
                listRelated(data._id).then(data => {
                    if(data.error){
                        setError(data.error);
                    }
                    else{
                        setRelatedProduct(data);
                    }
                })
                .catch(err => {
                    setError(err);
                })
            }
        }).catch(err => {
            setError(err);
        });
    }

    useEffect(() => {
        //get id from url (we get props becaue of react-router)
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, [props])


    const showErrorMessage = (err) => {
        if(err){
            return <h2>Something went wrong.</h2>
        }
    }

    return ( 
        <Layout title={product && product.name} description={product && product.description && product.description.substring(0, 100)} className="container-fluid">
            {showErrorMessage(error)}
            <div className='row ml-4'>
               <div className='col-8'>
                    {product && product.description && <Card product={product} showViewProductButton={false} />}
               </div>
                    
               <div className='col-4'>
                   <h2>Related Product</h2>
                   {relatedProduct.map((prod, i) => {
                        return(
                            <div className='mb-3'>
                                <Card product={prod} key={i} />
                            </div>
                        );
                    })}
               </div>
            </div>
        </Layout>
     );
}
 
export default Product;