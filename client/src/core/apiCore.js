import queryString from 'query-string';
const { API } = require("../config");


//removed ${API} for deployment
export const getProducts = (sortBy) => {
    return fetch(`/products?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
    .then(res => (res.json()))
    .catch(err => console.log("Error: Something went wrong in getProducts (apiCore.js)"));
}


export const getCategories = () => {
    return fetch(`/categories`, {
        method: "GET"
    })
    .then(data => (data.json()))
    .catch(err => console.log("Error: Something went wrong in getCategories (apiCore.js)"));
}


export const getFilteredProducts = (skip, limit, filters = {}) => {
    const data = { skip, limit, filters }
    return fetch(`/products/by/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => (res.json()))
    .catch(err => console.log("Error: Something went wrong in getFilteredProducts (apiCore.js)"));
}

export const list = (params) => {
    const query = queryString.stringify(params);
    return fetch(`/products/search?${query}`, {
        method: "GET"
    })
    .then(res => { 
        return res.json() 
    })
    .catch(err => {
        console.log("Error: Something went wrong in list (apiCore.js)")
    });
}


export const read = (productId) => {
    return fetch(`/product/${productId}`, {
        method: "GET"
    })
    .then(res => { 
        return res.json() 
    })
    .catch(err => {
        console.log("Error: Something went wrong in read (apiCore.js)")
    });
}


export const listRelated = (productId) => {
    return fetch(`/products/related/${productId}`, {
        method: "GET"
    })
    .then(data => (data.json()))
    .catch(err => console.log("Error: Something went wrong in listRelated (apiCore.js)"));
}


export const getBraintreeClientToken = (userId, token) => {
    return fetch(`/braintree/getToken/${userId}`, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(data => (data.json()))
    .catch(err => console.log("Error: Something went wrong in getBraintreeClientToken (apiCore.js)"));
}


export const processPayment = (userId, token, paymentData) => {
    return fetch(`/braintree/payment/${userId}`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    })
    .then(data => (data.json()))
    .catch(err => console.log("Error: Something went wrong in getBraintreeClientToken (apiCore.js)", err));
}


export const createOrder = (userId, token, createOrderData) => {
    // console.log(`9 -> At createOrder: userId = ${userId}, token = ${token}, createOrderData = ${createOrderData}`);
    return fetch(`/order/create/${userId}`, {
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
    .catch(err => console.log("Error: Something went wrong in createOrder (apiCore.js)", err));
}
