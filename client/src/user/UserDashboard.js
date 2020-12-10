import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Layout from '../core/Layout';
import { getPurchaseHistory } from './apiUser';
import moment from 'moment';


const Dashboard = () => {

    const [history, setHistory] = useState([])
    const { user: { _id, name, email, role }} = isAuthenticated();

    const token = isAuthenticated().token;

    const init = (userId, token) => {
        getPurchaseHistory(userId, token)
        .then(data => {
            if(data.error){
                console.log("1 -> Error at UserDashboard (purchase history): ", data.error);
            }
            else{
                setHistory(data);
            }
        }).catch(err => {
            console.log("2 -> Error at UserDashboard (purchase history): ", err);
        });
    }

    useEffect(() => {
        init(_id, token);
    }, [])

    const userLinks = () => {
        return(
            <div className="card">
                <h4 className='card-header'>User Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className='nav-link' to='/cart'> My Cart </Link>
                    </li>
                </ul>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className='nav-link' to={`/profile/${_id}`}> Update Profile </Link>
                    </li>
                </ul>
            </div>
        );
    }

    const userInfo = () => {
        return(
            <div className='card mb-5'>
                <h3 className='card-heading ml-2'>User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">{role === 1 ? 'Admin' : 'User'}</li>
                </ul>
            </div>
        );
    }

    const purchaseHistory = (history) => {
        return(
            <div className='card mb-5'>
                <h3 className='card-heading ml-2'>Purchase History</h3>
                <ul className="list-group">
                        {history.map((h, i) => (
                            h.products.map((p, pIndex) => (
                                <li className="list-group-item" key={pIndex}>
                                    <h6> Product Name: {p.name}</h6>
                                    <h6> Product Price: ${p.price}</h6>
                                    <h6> Purchased Date: {moment(p.createdAt).fromNow()}</h6>
                                </li>
                            ))
                        ))}
                </ul>
            </div>
        );
    }
    return ( 
        <Layout title="Dashboard" description={`Good day ${name}`} className="container-fluid">
            <div className='row'>
                <div className='col-3'> {userLinks()} </div>
                <div className='col-9'>
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
     );
}
 
export default Dashboard;