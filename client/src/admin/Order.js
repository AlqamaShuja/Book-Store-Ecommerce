import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth/index';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import moment from 'moment';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    const { user, token } = isAuthenticated();

    const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if(data.error){
                console.log(data.error);
            }
            else{
                setOrders(data);
            }
        })
    }

    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {
            if(data.error){
                console.log(data.error);
            }
            else{
                setStatusValues(data);
            }
        })
    }

    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, []);

    const showOrdersLength = () => {
        if(orders.length > 0){
            return <h2 className="text-danger display-2">Total orders: {orders.length} </h2>
        }else{
            return <h1 className='text-danger'>No Orders</h1>
        }
    }


    const showInput = (key, value) => {
        return(
            <div className='input-group mb-2 mr-sm-2'>
                <div className='input-group-prepend'>
                    <div className="input-group-text">{key}</div>
                </div>
                <input type='text' className="form-control"
                    value={value} readOnly />
            </div>
        )
    }

    const handleStatusChange = (e, orderId) => {
        //request backend to update status
        updateOrderStatus(user._id, token, orderId, e.target.value)
        .then(data => {
            if(data.error){
                console.log("Status update failed");
            }else{
                loadOrders();
            }
        })
    }

    const showStatus = (o) => {
        return(
            <div className="form-group">
                <h3 className="mark mb-4">Status: {o.status}</h3>
                <select className="form-control" onChange={(e) => handleStatusChange(e, o._id)}>
                    <option>Update Status</option>
                    {statusValues.map((status, i) => (
                        <option key={i} value={status}> {status} </option>
                    ))}
                </select>
            </div>
        );
    }

    return ( 
        <Layout title='Order' description={`Hi ${user.name}, You can manage all the orders here.`}>
            <div className='container row'>
                <div className='col-md-8 offset-md-2'>
                    {showOrdersLength()}
                    {orders.map((o, oIndex) => {
                        return(
                            <div className="mt-5" style={{ borderBottom: '5px solid indigo' }} key={oIndex}>
                                <h2 className="mb-5">
                                    <span className="bg-primary"> Order ID: {o._id} </span>
                                </h2>
                                <ul className="list-group mb-2">
                                    <li className="list-group-item"> {showStatus(o)} </li>
                                    <li className="list-group-item"> Transaction ID: {o.transaction_id} </li>
                                    <li className="list-group-item"> Amount: ${o.amount} </li>
                                    <li className="list-group-item"> Order by: {o.user.name} </li>
                                    <li className="list-group-item"> Order on: {moment(o.createdAt).fromNow()} </li>
                                    <li className="list-group-item"> Delivery Address: {o.address} </li>
                                </ul>

                                <h3 className="mt-4 mb-4 font-italic">
                                    Total product in the order: {o.products.length}
                                </h3>
                                
                                {o.products.map((p, pIndex) => (
                                    <div className='mb-4' key={pIndex} style={{ padding: '20px', border: '1px solid indigo' }}>
                                        {showInput('Product name', p.name)}
                                        {showInput('Product price', p.price)}
                                        {showInput('Product total', p.count)}
                                        {showInput('Product Id', p._id)}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
     );
}
 
export default Orders;


