const { API } = require("../config");

//
//removed ${API}
//

export const createCategory = (userId, token, category) => {
    return fetch(`/api/category/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-type": 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
    .then(res => (res.json()))
    .catch(err => { console.log(err) });
}



export const createProduct = (userId, token, product) => {
    return fetch(`/api/product/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        // does not stringify because it has to be a form-data
        body: product
    })
    .then(res => (res.json()))
    .catch(err => { console.log(err) });
}


export const getCategories = () => {
    return fetch(`/api/categories`, {
        method: "GET"
    })
    .then(data => (data.json()))
    .catch(err => console.log(err));
}


export const listOrders = (userId, token) => {
    return fetch(`/api/order/list/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        } 
    })
    .then(data => (data.json()))
    .catch(err => console.log(err));
}


export const getStatusValues = (userId, token) => {
    return fetch(`/api/order/status-values/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        } 
    })
    .then(data => (data.json()))
    .catch(err => console.log(err));
}


export const updateOrderStatus = (userId, token, orderId, status) => {
    return fetch(`/api/order/${orderId}/status/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status })
    })
    .then(response => (response.json()))
    .catch(err => console.log(err));
}

//perform CRUD on Product
//get all products
export const getProducts = () => {
    return fetch(`/api/products?limit=undefined`, {
        method: 'GET'
    })
    .then(data => (data.json()))
    .catch(err => console.log(err));
}


//get single product by Id
export const getProduct = (prodId) => {
    return fetch(`/api/product/${prodId}`, {
        method: 'GET'
    })
    .then(data => (data.json()))
    .catch(err => console.log(err));
}


//update product
export const updateProduct = (prodId, userId, token, product) => {
    return fetch(`/api/product/${prodId}/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        //does not stringify because it has to be a form-data
        body: product
    })
    .then(res => {
        return res.json()
    })
    .catch(err => { console.log({err}) });
}


//delete Product
export const deleteProduct = (prodId, userId, token) => {
    return fetch(`/api/product/${prodId}/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => (res.json()))
    .catch(err => { console.log(err) });
}