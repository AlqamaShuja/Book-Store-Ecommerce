import React, { useState } from 'react';
import moment from 'moment';
import ShowImage from './ShowImage';
import { Link, Redirect } from 'react-router-dom';
import { addItem, updateItem, removeItem } from './cartHelpers';




const Card = ({ 
    product, 
    showViewProductButton=true, 
    showCartButton=true, 
    cartUpdate=false, 
    showRemoveProductButton=false,
    setRun = f => f,   
    run = undefined
}) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);

    const showViewButton = (showViewProductButton) => {
        if(showViewProductButton){
            return(
                <Link to={`/product/${product._id}`}>
                    <button className="btn btn-outline-primary mb-2 mt-2"> View Product </button>
                </Link>
            )
        } 
    }

    const shouldRedirect = (redirect) => {
        if(redirect){
            return <Redirect to='/cart' />
        }
    }

    const addToCart = () => {
        addItem(product, () => {
            setRedirect(true);
        });
    }

    const showAddToCartButton = () => {
        if(showCartButton){
            return(
                <button onClick={addToCart} className={`btn btn-outline-warning mb-2 mt-2 ${showViewProductButton===true ? `ml-3`: ''}`}> 
                    Add to Cart 
                </button>
            );
        }
    }

    const removeFromCart = (productId) => {
        removeItem(productId);
    }

    const showRemoveButton = (showRemoveProductButton) => {
        if(showRemoveProductButton){
            return(
                <button onClick={() => {
                    removeFromCart(product._id);
                    setRun(!run);
                    }
                } className={`btn btn-outline-danger mb-2 mt-2 ${showViewProductButton===true ? `ml-3`: ''}`}> 
                    Remove Product
                </button>
            );
        }
    }

    const showStock = (quantity) => {
        return quantity > 0 ? (<span className="bafge badge-primary badge-pill">In Stock</span>) 
        : 
        (<span className="bafge badge-primary badge-pill">Out of Stock</span>)
    }

    // const handleChange = (productId) => event => {
    //     setCount(event.target.value < 1 ? 1 : event.target.value);
    //     if(event.target.value >= 1){
    //         updateItem(productId, event.target.value)
    //     }
    // }
    const handleChange = (event, productId) => {
        setRun(!run);
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if(event.target.value >= 1){
            updateItem(productId, event.target.value)
        }
    }

    const showCartUpdateOptions = (cartUpdate) => {
        return cartUpdate && <div>
            <div className="input-group- mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">Adjust Quantity</span>
                    <input type='number' className="form-control" value={count} onChange={(e) => handleChange(e, product._id)} />
                </div>
            </div>
        </div>
    }

    return ( 
        // <div className="col-4 mb-3" >
            <div className="card">
                <div className="card-header name">{product.name}</div>
                <div className="card-body">
                    {shouldRedirect(redirect)}
                    <ShowImage item={product} url='product' />
                    <p className="lead mt-2">{product.description.substring(0, 100)}</p>
                    <p className="black-10">${product.price}</p> 
                    <p className="black-9">Category: {product.category && product.category.name}</p> 
                    <p className="black-8">Added on: {moment(product.createdAt).fromNow()}</p> 

                    {showStock(product.quantity)}
                    <br />
                    {showViewButton(showViewProductButton)}
                    {showAddToCartButton()}
                    {showRemoveButton(showRemoveProductButton)}

                    {showCartUpdateOptions(cartUpdate)}
                </div>
            </div>
        // </div>
     );
}
 
export default Card;