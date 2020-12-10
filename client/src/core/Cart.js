import React, { useEffect, useState } from 'react';
import { getCart } from './cartHelpers';
import Card from './Card';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import Checkout from './Checkout';


const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart())
    }, [run]);

    const showItems = (items) => {
        return(
            <div>
                <h2>Your cart has {`${items.length}`} items.</h2>
                <hr />
                {items.map((item, i) => (
                    <Card key={i} product={item} 
                        showCartButton={false} 
                        cartUpdate={true} 
                        showRemoveProductButton={true}
                        run={run}
                        setRun={setRun}
                    />))}
            </div>
        );
    }

    const noItemMessage = () => {
        return(
            <h2>
                Your cart is empty. <br /> <Link to="/shop" >Continue Shopping</Link>
            </h2>
        );
    }

    return ( 
        <Layout title="Shopping Cart" 
            description="Manage your cart items. Add or Remove checkout Or continue shopping." 
            className="container-fluid">
            <div className='row'>
                <div className='col-6'>
                    {items.length > 0 ? showItems(items) : noItemMessage()}
                </div>

                <div className='col-6'>
                    <h2 className="mb-3">Your Cart Summary</h2>
                    <hr />
                    <Checkout products={items} run={run} setRun={setRun} />
                </div>
            </div>
        </Layout>
     );
}
 
export default Cart;