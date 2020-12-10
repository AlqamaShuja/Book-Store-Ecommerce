import React, { useEffect, useState } from 'react';
import { getCategories, list } from './apiCore';
import Card from './Card';



const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    });

    const { categories, category, search, results, searched } = data;

    const loadCategories = () => {
        getCategories().then(resData => {
            if(resData.error !== undefined){
                console.log(resData.error);
            }
            else{
                setData({ ...data, categories: resData});
            }
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        loadCategories();
    }, []);


    const searchData = () => {
        // console.log(search, category);
        if(search){
            list({ search: search || undefined, category: category })
            .then(resData => {
                if(resData.error){
                    console.log(resData.error);
                }
                else{
                    setData({ ...data, results: resData, searched: true });
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    }


    const searchSubmit = (e) => {
        e.preventDefault();
        searchData();
    }

    const handleChange = (name) => (event) => {
        setData({ ...data, [name]: event.target.value, searched: false });
    }

    const searchForm = () => {
        return(
            <form onSubmit={searchSubmit}>
                <span className="input-group-text">
                    <div className="input-group input-group-lg">
                        <div className="input-group-prepend">
                            <select className="btn mr-2" onChange={handleChange('category')} >
                                <option value="All">All</option>
                                {categories.map((cat, i) => <option key={i} value={cat._id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <input className="form-control" onChange={handleChange('search')} placeholder="Search by name"></input>
                    </div>

                    <div className="btn input-group-append" style={{border: 'none'}} >
                        <button className="input-group-text">Search</button>
                    </div>
                </span>
            </form>
        );
    }

    const searchMessage = (searched, results) => {
        if(searched && results.length > 0){
            return `Found ${results.length} products`
        }
        else if(searched && results.length < 1){
            return `No products found`
        }
    }

    const searchedProducts = (results = []) => {
        return(
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2>
                <div className="row">
                    {results.map((product, i) => <Card key={i} product={product} />)}
                </div>
            </div>
        );
    }

    return ( 
        <div className="row">
            <div className="container mb-3">
                {searchForm()}
            </div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
            </div>
        </div>
     );
}
 
export default Search;