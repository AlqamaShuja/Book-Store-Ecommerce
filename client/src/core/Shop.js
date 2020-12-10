import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Card from './Card';
import Checkbox from './Checkbox';
import RadioBox from './RadioBox';
import { getCategories, getFilteredProducts } from './apiCore';
import { prices } from './fixedPrices';



const Shop = () => {
    const [myFilter, setMyFilter] = useState({
        filters: { category: [], price: [] }
    });
    const [categories, setCategories] = useState([]);
    // const [price, setPrice] = useState([]);
    const [error, setError] = useState(false);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [limit, setLimit] = useState(6);
    const [filteredResult, setFilteredResult] = useState([]);

    const init = () => {
        getCategories()
        .then(data => {
            if(data.error){
                setError(data.error);
            }
            else{
                setCategories(data);
            }
        })
        .catch(err => { setError(err) });
    }

    const loadFilteredResults = (newFilters) => {
        // console.log(newFilters);
        getFilteredProducts(skip, limit, newFilters)
        .then(data => {
            if(data.error){
                setError(data.error);
            }
            else{
                setFilteredResult(data.products);
                setSize(data.size);
                setSkip(0);
            }
        })
        .catch(err => setError(err));
    }

    const loadMore = () => {
        const toSkip = skip + limit;
        getFilteredProducts(toSkip, limit, myFilter.filters)
        .then(data => {
            if(data.error){
                setError(data.error);
            }
            else{
                setFilteredResult([...filteredResult, ...data.products]);
                setSize(data.size);
                setSkip(toSkip);
            }
        })
        .catch(err => setError(err));
    }

    const loadMoreButton = () => {
        return(
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">Load More...</button>
            )
        );
    }

    useEffect(() => {
        init();
        loadFilteredResults(skip, limit, myFilter.filters)
    }, []);

    const handleFilters = (filters, filterBy) => {
        // console.log(filter, filterBy);
        const newFilters = { ...myFilter };
        newFilters.filters[filterBy] = filters;

        if(filterBy === 'price'){
            let priceValue = handlePrice(filters);
            newFilters.filters[filterBy] = priceValue;
        }

        loadFilteredResults(myFilter.filters);
        setMyFilter(newFilters);
    }

    const handlePrice = (value) => {
        return prices[value].array;
    }

    const showErrorMessage = (err) => {
        if(err){
            return <h2>Something went wrong.</h2>
        }
    }


    return ( 
        <Layout title="Shop page" description="Search and find a book of your choice.." className="container-fluid">
            {showErrorMessage(error)}
            <div className="row">
                <div className='col-4'>
                    <h4>Filter By Categories</h4>
                    <ul>
                        <Checkbox categories={categories} handleFilters={filter => handleFilters(filter, 'category')} />
                    </ul>
                    <h4>Filter By Price Range</h4>
                    <div>
                        <RadioBox prices={prices} handleFilters={filter => handleFilters(filter, 'price')} />
                    </div>
                </div>
                {filteredResult.length > 0 ? <div className='col-8'>
                    <h2 className="mb-4">Products</h2>
                    <div className='row'>
                        {filteredResult.map((product, i) => (
                            <div className="col-4 mb-3" key={i} >
                                <Card  product={product} />
                            </div>
                        ))}
                    </div>
                    {loadMoreButton()}
                </div> : <h2 className="mb-4">No Product Found</h2>}
            </div>
        </Layout>
     );
}
 
export default Shop;