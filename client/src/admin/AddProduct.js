import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth/index';
import { createProduct, getCategories } from './apiAdmin';


const AddProduct = () => {
    const { user, token} = isAuthenticated();
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    });

    const init = () => {
        getCategories()
        .then(data => {
            if(data.error){
                setValues({ ...values, error: data.error });
            }
            else{
                setValues({ ...values, categories: data, formData: new FormData() });
            }
        })
        .catch()
    }

    useEffect(() => {
        init();
    }, []);

    const {name, description, price, categories, quantity, loading, error, createdProduct, formData} = values;

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    }

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });
        // console.log(formData);
        createProduct(user._id, token, formData)
        .then(data => {
            if(data.error){
                setValues({ ...values, error: data.error });
            }
            else{
                setValues({ 
                    ...values,
                    name: '',
                    description: '',
                    price: '',
                    shipping: '',
                    quantity: '',
                    category: '',
                    photo: '',
                    loading: false,
                    error: '',
                    createdProduct: name
                })
            }
        })
        .catch(err => setValues({ ...values, error: err }));
    } 

    const newPostForm = () => {
        return(
            <form className="ml-2 mr-2 mb-3" onSubmit={clickSubmit}>
                <h4>Post Photo</h4>
                <div className="form-group" >
                    <label className="btn btn-secondary">
                        <input onChange={handleChange('photo')} type="file" name='photo' accept="image/*" />
                    </label>
                </div>

                <div className='form-group'>
                    <label className='text-muted'>Name</label>
                    <input onChange={handleChange('name')} className='form-control' type='text' value={name} />
                </div>

                <div className='form-group'>
                    <label className='text-muted'>Description</label>
                    <textarea onChange={handleChange('description')} className='form-control' value={description} />
                </div>

                <div className='form-group'>
                    <label className='text-muted'>Price</label>
                    <input onChange={handleChange('price')} className='form-control' type='number' value={price} />
                </div>

                <div className='form-group'>
                    <label className='text-muted'>Category</label>
                    <select onChange={handleChange('category')} className='form-control'>
                        <option selected>Please Select</option>
                        {categories && categories.map((cat, i) => ( <option key={i} value={cat._id}>{cat.name}</option> ))}
                    </select>
                </div>

                <div className='form-group'>
                    <label className='text-muted'>Shipping</label>
                    <select onChange={handleChange('shipping')} className='form-control'>
                        <option selected>Please Select</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label className='text-muted'>Quantity</label>
                    <input onChange={handleChange('quantity')} className='form-control' type='number' value={quantity} />
                </div>

                <button className='btn btn-outline-primary'>Create Product</button>
            </form>
        );
    }

    const showSuccess = () => {
        return(
            <div className="alert alert-info" style={{ display: createdProduct ? "" : "none" }}>
                <h2>{`${createdProduct} is created`}</h2>
            </div>
        );
    }

    const showError = () => {
        return(
            <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                {error}
            </div>
        );
    }

    const showLoading = () => {
        if(loading){
            return(
                <div className="alert alert-success">
                    <h2>Loading...</h2>
                </div>
            );
        }
    }

    return ( 
        <Layout title='Create Product' description={`Hi ${user.name}! Ready to Create a new Product`}>
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
     );
}
 
export default AddProduct;


