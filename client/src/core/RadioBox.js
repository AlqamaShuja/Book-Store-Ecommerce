import React, { useState } from 'react';


const RadioBox = ({ prices, handleFilters }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event) => {
        handleFilters(event.target.value);
        setValue(event.target.value);
    }

    return ( 
        prices.map((price, i) => (
            <div key={i}>
                <label className="form-check-label" >
                    <input type="radio" className='mr-2 ml-3' name={price} value={`${price._id}`} onChange={handleChange} />
                    {price.name}
                </label>
            </div>
        ))
     );
}
 
export default RadioBox;