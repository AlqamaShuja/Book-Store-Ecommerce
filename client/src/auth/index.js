// import React from 'react';
import { API } from '../config';


//removed ${API}
export const signup = (user) => {
    // console.log(name, email, password);
    return fetch(`/api/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then((response) => {
        return response.json();
    })
    .catch(err => {
        return console.log(err);
    })
}


export const signin = (user) => {
    return fetch(`/api/signin`,{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(user),
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
}


export const authenticate = (data, next) => {
    if(typeof window !== 'undefined'){ 
        localStorage.setItem('jwt', JSON.stringify(data));
        next();
    }
}

export const signout = (next) => {
    if(typeof window !== 'undefined'){
        localStorage.removeItem('jwt');
        next();
        return fetch(`/api/signout`, {
            method: 'GET',
        })
        .then(response => { console.log('signout(res)', response)})
        .catch(err => { console.log('signout(err)', err) });
    }
}


export const isAuthenticated = () => {
    if(typeof window == 'undefined'){
        return false
    }

    if(localStorage.getItem('jwt')){
        return JSON.parse(localStorage.getItem('jwt'));
    }
    else{
        return false;
    }
}