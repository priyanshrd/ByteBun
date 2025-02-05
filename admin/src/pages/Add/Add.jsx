import React, { useState, useEffect } from 'react';
import './Add.css';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
const Add = () => { 
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        restaurant_id: ""  // Added restaurant_id field
    });

    const location = useLocation();
    useEffect(() => {
        if (location.state?.selectedRestaurantId) {
            setData(data => ({ ...data, restaurant_id: location.state.selectedRestaurantId }));
        }
    }, [location.state?.selectedRestaurantId]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Image not selected');
            return null;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("restaurant_id", data.restaurant_id);  // Sending restaurant_id as well
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: data.category,
                    restaurant_id: location.state?.selectedRestaurantId || ""  // Reset but keep restaurant_id if selected
                });
                setImage(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while adding the product');
        }
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Upload image</p>
                    <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="Upload Area" />
                    </label>
                </div>
                <div className='add-product-name flex-col'>
                    <p>Product name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Type here' required />
                </div>
                <div className='add-product-description flex-col'>
                    <p>Product description</p>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} rows={6} placeholder='Write content here' required />
                </div>
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Product category</p>
                        <select name='category' onChange={onChangeHandler}>
                            <option value="Biriyani">Biriyani</option>
                            <option value="Indian">Indian</option>
                            <option value="Italian">Italian</option>
                            <option value="Burgers">Burgers</option>
                            <option value="Chinese">Chinese</option>
                            <option value="South Indian">South Indian</option>
                            <option value="Ice Creams">Ice Creams</option>
                            <option value="Chaats">Chaats</option>
                            <option value="Seafood">Seafood</option>
                            <option value="Momos">Momos</option>
                            <option value="Salad">Salad</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Meat">Meat</option>
                            <option value="Dessert">Dessert</option>
                        </select>
                    </div>
                    <div className='add-price flex-col'>
                        <p>Product Price</p>
                        <input type="Number" name='price' onChange={onChangeHandler} value={data.price} placeholder='25' required />
                    </div>
                </div>

                {/* New field for entering restaurant_id */}
                <div className='add-restaurant-id flex-col'>
                    <p>Restaurant ID</p>
                    <input name='restaurant_id' onChange={onChangeHandler} value={data.restaurant_id} type="text" placeholder='Enter Restaurant ID' required />
                </div>

                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    );
}

export default Add;
