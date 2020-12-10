import React, { useState } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth/index';
import { createCategory } from './apiAdmin';
import { Link } from 'react-router-dom';


const AddCategory = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setsuccess] = useState(false);

    const {user, token} = isAuthenticated();

    const handleChange = (e) => {
        setError(false);    
        setName(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(false);
        setsuccess(false);

        //make API request to create category
        createCategory(user._id, token, {name})
        .then(data => {
            if(data.error){
                setError(true);
            }
            else{
                setError('');
                setsuccess(true);
            }
        })
        .catch(err => { setError(true) });
    } 

    const showSuccess = () => {
        if(success){
            return <h3 className='text-success'>{name} is created</h3>
        }
    }

    
    const showError = () => {
        if(error){
            return <h3 className='text-danger'>Category should be unique</h3>
        }
    }

    const goBack = () => (
        <div className="mt-5">
            <Link to='/admin/dashboard' className='text-warning'>Back to Dashboard</Link>
        </div>
    );

    const newCategoryForm  = () => {
        return(
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className='text-muted'>Category Name</label>
                    <input className='form-control'
                        type='text' 
                        onChange={handleChange} 
                        value={name}
                        autoFocus
                        required
                    />
                </div>
                <button className='btn btn-outline-primary' >Add Category</button>
            </form>
        );
    }

    return ( 
        <Layout title='Create Category' description={`Hi ${user.name} Create a new category for user`}>
            <div className='container row'>
                <div className='col-md-8 offset-md-2'>
                    {showError()}
                    {showSuccess()}
                    {newCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Layout>
     );
}
 
export default AddCategory;