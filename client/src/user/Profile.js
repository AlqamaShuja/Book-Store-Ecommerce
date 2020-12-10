import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { read, update, userUpdate } from './apiUser';
import { isAuthenticated } from '../auth';
import Layout from '../core/Layout';


const Profile = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: false,
        success: false
    });

    const { token } = isAuthenticated();
    const { name, email, password, error, success } = values;

    const init = (userId) => {
        read(userId, token)
        .then(data => {
            if(data.error){
                setValues({ ...values, error: true });
            }
            else{
                setValues({ ...values, name: data.name, email: data.email })
            }
        })
        .catch(err => {
            setValues({ ...values, error: err });
        })
    }

    useEffect(() => {
        init(match.params.userId);
        // init('5f8b4c25235abb2ea832867e')
    }, []);


    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    }

    const redirectUser = (success) => {
        if(success){
            return <Redirect to="/cart" />
        }
    }

    const clickSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, error: false });
        update(match.params.userId, token, { name, email, password })
        .then(data => {
            if(data.error){
                setValues({ ...values, error: data.error })
            }
            else{
                userUpdate(data, () => {
                    setValues({ ...values, name: data.name, email: data.email, success: true });
                })
            }
        })
        .catch();
    }

    const profileUpdate = (name, email, password) => {
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


    const showErrorMessage = (err) => {
        if(err){
            return <h2>Something went wrong.</h2>
        }
    }

    return ( 
        <Layout title="Profile" description="Update your Profile" className="container-fluid">
            {showErrorMessage(error)}
            <h2 className="mb-4">Profile Update</h2>
            {profileUpdate(name, email, password)}
            {redirectUser(success)}
        </Layout>
     );
}
 
export default Profile;

