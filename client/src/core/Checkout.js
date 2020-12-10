import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getBraintreeClientToken, processPayment, createOrder } from './apiCore';
import { emptyCart } from './cartHelpers';
import DropIn from 'braintree-web-drop-in-react';
// import Card from './Card';
// import Layout from './Layout';



const Checkout = ({ products, run, setRun = f => f }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token)
        .then(resData => {
            if(resData.error){
                setData({
                    ...data,
                    error: resData.error
                });
            }
            else{
                setData({
                    ...data,
                    clientToken: resData.clientToken
                });
            }
        })
    }

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0)
    }

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Signin to Checkout</button>
            </Link>
        )
    }

    const showError = (error) => {
        return(
            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                {error}
            </div>
        );
    }

    const showSuccess = (success) => {
        return(
            <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
                Thanks! Your payment was successfull.
            </div>
        );
    }

    const showLoading = (loading) => loading && <h2>Loading...</h2>


    const buy = () => {
        //make loading to true.
        setData({ ...data, loading: true});
        //send the nonce to your server (nonce = data.instance.requestPaymentMethod())
        let nonce;
        let delievryAddress = data.address;
        data.instance.requestPaymentMethod().then(data => {
            // console.log(data);
            nonce = data.nonce;
            //once you have nonce (cart type, card number) send nonce as 'paymentMethodNonce'
            //and also total to be charged
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getTotal()
            }
            
            //call processPayment method from apiCore
            processPayment(userId, token, paymentData)
            .then(data => {
                // console.log("processPayment: ", data)
                setData({ ...data, success: data.success });

                //create order
                const createOrderData = {
                    products: products,
                    transaction_id: data.transaction.id,
                    amount: data.transaction.amount,
                    address: delievryAddress
                }

                createOrder(userId, token, createOrderData)
                .then(response => {
                    //empty cart
                    emptyCart(() => {
                        console.log("Payment successfully and empty cart.");
                    });
                    
                    setData({ ...data, loading: false, success: true });

                    //for re render the cart to show empty cart
                    setRun(!run);

                })
                .catch(error => {
                    console.log(error);
                    setData({ loading: false });
                });    

            })
            .catch(error => {
                console.log(error);
                setData({ ...data, loading: false});
            });

        }).catch(error => {
            console.log('DropIn Error: ', error);
            setData({
                ...data,
                error: error.message
            });
        })
    } 


    const handleAddress = (event) => {
        setData({ ...data, address: event.target.value });
    }

    const showDropIn = () => (
        <div onBlur={() => setData({ ...data, error: '' })}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <div>
                        <label className='text-muted'>Delivery Address: </label>
                        <textarea className="form-control" value={data.address} 
                            onChange={handleAddress} placeholder="Type your delivery address.."
                        />
                    </div>
                    <DropIn options={{ 
                        authorization: data.clientToken,
                        paypal: { flow: 'vault' }
                    }}
                        onInstance={instance => (data.instance = instance)}
                    />
                    <button onClick={buy} className='btn btn-success btn-block'>Pay</button>
                </div>
            ): null }
        </div>
        //use this in showCheckout()
    );

    useEffect(() => {
        getToken(userId, token);
    }, []);

    return ( 
        <div>
            <h2>Total: ${getTotal()}</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
     );
}
 
export default Checkout;