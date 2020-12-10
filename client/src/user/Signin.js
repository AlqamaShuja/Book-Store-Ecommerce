import React, { useState } from 'react';
import Layout from '../core/Layout';
import { authenticate, signin, isAuthenticated } from '../auth/index';
import { Redirect } from 'react-router-dom';


const Signin = () => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        redirectToReferrer: false
    });

    const { email, password, error, loading, redirectToReferrer } = values;
    const { user } = isAuthenticated();


    const handleChange = (name) => event => {
        setValues({ ...values, [name]: event.target.value });
    }

    const handleClick = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });
        signin({ email, password })
        .then(data => {
            if(data.error){
                setValues({ ...values, error: data.error, loading: false });
            }
            else{
                authenticate(data, () => {
                    setValues({ ...values, loading: false, redirectToReferrer: true });
                })
            }
        });
    }

    const showError = () => {
        return(
            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }} >
                {error}
            </div>
        );
    }

    const showLoading = () => {
        if(loading){
            return (
                <div className="alert alert-info">
                    <h2> Loading... </h2>
                </div>
        );}
    }

    const redirctUser = () => {
        // if(isAuthenticated()){
        //     return <Redirect to="/dashboard" />
        // }
        if(redirectToReferrer){
            if(user && user.role === 1){
                return <Redirect to="/admin/dashboard" />
            }else{
                return <Redirect to="/user/dashboard" />
            }
        }
        if(isAuthenticated()){
            return <Redirect to='/' />
        }
    }

    const sigInForm = () => {
        return(
            <form className="form-group">
                <div>
                    <label className="text-muted">Email</label>
                    <input className="form-control" type="email" onChange={handleChange("email")} value={email} />
                </div>
                <div>
                    <label className="text-muted">Password</label>
                    <input className="form-control" type="password" onChange={handleChange("password")} value={password} />
                </div>
                <button className="btn btn-primary" onClick={handleClick}> Signin </button>
            </form>
        );
    }

    return ( 
        
        <Layout title="Signin" description="Signin to Node React Ecommerce App" className="container col-md-8 offset-md-2">
            {showError()}
            {showLoading()}
            {sigInForm()}
            {redirctUser()}
        </Layout>
     );
}
 
export default Signin;