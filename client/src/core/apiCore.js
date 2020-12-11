import queryString from 'query-string';
const { API } = require("../config");



export const getProducts = (sortBy) => {
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
    .then(res => (res.json()))
    .catch(err => (err.json()));
}


export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: "GET"
    })
    .then(data => (data.json()))
    .catch(err => (err.json()));
}


export const getFilteredProducts = (skip, limit, filters = {}) => {
    const data = { skip, limit, filters }
    return fetch(`${API}/products/by/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => (res.json()))
    .catch(err => (err.json()));
}

export const list = (params) => {
    const query = queryString.stringify(params);
    return fetch(`${API}/products/search?${query}`, {
        method: "GET"
    })
    .then(res => { 
        return res.json() 
    })
    .catch(err => {
        console.log(err)
        return err.json({ error: err });
    });
}


export const read = (productId) => {
    return fetch(`${API}/product/${productId}`, {
        method: "GET"
    })
    .then(res => { 
        return res.json() 
    })
    .catch(err => {
        console.log(err)
        return err.json({ error: err });
    });
}


export const listRelated = (productId) => {
    return fetch(`${API}/products/related/${productId}`, {
        method: "GET"
    })
    .then(data => (data.json()))
    .catch(err => err.json());
}


export const getBraintreeClientToken = (userId, token) => {
    return fetch(`${API}/braintree/getToken/${userId}`, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(data => (data.json()))
    .catch(err => console.log(err));
}


export const processPayment = (userId, token, paymentData) => {
    return fetch(`${API}/braintree/payment/${userId}`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    })
    .then(data => (data.json()))
    .catch(err => console.log(err));
}


export const createOrder = (userId, token, createOrderData) => {
    // console.log(`9 -> At createOrder: userId = ${userId}, token = ${token}, createOrderData = ${createOrderData}`);
    return fetch(`${API}/order/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: createOrderData })
    })
    .then(data => {
        return data.json()
    })
    .catch(err => console.log(err));
}
