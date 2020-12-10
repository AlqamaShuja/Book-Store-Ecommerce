import React, { useState } from 'react';


const Checkbox = ({ categories, handleFilters }) => {
    const [checked, setChecked] = useState([]);

    const handleToggle = category => () => {
        const currentCategoryId = checked.indexOf(category);
        const newCheckedCategoryId = [...checked];

        if(currentCategoryId === -1){
            //if currently checked was not already in checked then push it
            newCheckedCategoryId.push(category); 
        }
        else{
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }

        // console.log(newCheckedCategoryId);
        setChecked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);
    }
    return ( 
        categories.map((cat, i) => (
            <li className="list-unstyled" key={i}>
                <label className="form-check-label" >
                    <input onChange={handleToggle(cat._id)} value={checked.indexOf(cat._id) === -1 } type="checkbox" className='form-check-input' />
                    {cat.name}
                </label>
            </li>
        ))
     );
}
 
export default Checkbox;