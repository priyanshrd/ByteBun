import React, { useEffect, useState } from 'react'
import './List.css'
import { assets, url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);

  const [data, setData] = useState({
          name: "",
          description: "",
          price: "",
          category: "Salad",
          restaurant_id: "" ,
          rating: 0  // Added restaurant_id field
      });

  const updateFood = async (foodId) => {

    
    
    const urlToFile = async (url, filename, mimeType) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: mimeType });
    };
    
    // Usage
    const imageFile = await urlToFile(foodId.image, "image.jpg", "image/jpeg");


    const formData = new FormData();
        formData.append("name", foodId.name);
        formData.append("description", foodId.description);
        formData.append("price", prompt("Enter new price", foodId.price));
        formData.append("category", foodId.category);
        formData.append("restaurant_id", foodId.restaurant_id);  // Sending restaurant_id as well
        formData.append("image", imageFile);
        formData.append("rating", Number(foodId.rating));  // Sending rating as well



    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
          toast.success(response.data.message);
          setData({
              name: foodId.name,
              description: foodId.description,
              price: prompt("Enter new price", foodId.price),
              category: foodId.category,
              restaurant_id: foodId.restaurant_id,
              rating: foodId.rating  // Reset but keep restaurant_id if selected
          });
          setImage(false);
      } else {
          toast.error(response.data.message);
      }
      } catch (error) {
          toast.error('An error occurred while adding the product');
      }
  }

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p className='cursor' onClick={() => updateFood(item._id)}>{currency}{item.price}</p>
              <p className='cursor' onClick={() => removeFood(item._id)}>x</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
