import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { signup } from '../auth/index';


const Signup = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    const { name, email, password, error, success } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    }

    const clickSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, error: false });
        signup({name, email, password})
        .then(data => {
            
            if(data.error){
                setValues({ ...values, error: data.error, success: false });
            }
            else{
                setValues({ ...values, name: '', email: '', password: '', success: true });
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

    const showSuccess = () => {
        return(
            <div className="alert alert-info" style={{ display: success ? '' : 'none' }} >
                Your account has been created. Please <Link to="/signin"> Signin </Link>
            </div>
        );
    }

    const signUpForm = () => {
        return(
            <form>
                <div className='form-group'>
                    <label className='text-muted'> Name </label>
                    <input className="form-control" type="text" onChange={handleChange("name")} value={name} />
                </div>
                <div className='form-group'>
                    <label className='text-muted'> Email </label>
                    <input className="form-control" type="email" name="email" onChange={handleChange("email")} value={email} />
                </div>
                <div className='form-group'>
                    <label className='text-muted'> Password </label>
                    <input className="form-control" type="password" name="password" onChange={handleChange("password")} value={password}/>
                </div>
                <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
            </form>
        );
    }
    return ( 
        <Layout title="Signup" description="Signup to Node React Ecommerce App" className="container col-md-8 offset-md-2">
            {showError()}
            {showSuccess()}
            {signUpForm()}
        </Layout>
     );
}
 
export default Signup;