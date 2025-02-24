import basket_icon from './basket_icon.png'

import logo from './logo.jpg'
import search_icon from './search_icon.png'
import menu_1 from './menu_1.png'
import menu_2 from './menu_2.png'
import menu_3 from './menu_3.png'
import menu_4 from './menu_4.png'
import menu_5 from './menu_5.png'
import menu_6 from './menu_6.png'
import menu_7 from './menu_7.png'
import menu_8 from './menu_8.png'
import menu_9 from './menu_9.png'
import menu_10 from './menu_10.png'
import menu_11 from './menu_11.png'
import menu_12 from './menu_12.png'
import menu_13 from './menu_13.png'
import menu_14 from './menu_14.png'
import menu_15 from './menu_15.png'
import menu_16 from './menu_16.png'
import menu_17 from './menu_17.png'


import restaurant_1 from './restaurant_1.jpg'
import restaurant_2 from './restaurant_2.jpg'
import restaurant_3 from './restaurant_3.jpg'
import restaurant_4 from './restaurant_4.jpg'
import restaurant_5 from './restaurant_5.jpg'
import restaurant_6 from './restaurant_6.jpg'
import restaurant_7 from './restaurant_7.jpg'
import restaurant_8 from './restaurant_8.jpg'
import restaurant_9 from './restaurant_9.jpg'
import restaurant_10 from './restaurant_10.jpg'


export const restaurants = [
  { _id: 'abc123xyz', name: 'Stonny Brook', image: restaurant_1 },
  { _id: 'def456uvw', name: 'Ambrosia', image: restaurant_2 },
  { _id: 'ghi789rst', name: 'The Nachiyar Cafe', image: restaurant_3 },
  { _id: 'jkl012mno', name: 'Big Barrell Brewpub', image: restaurant_4 },
  { _id: 'mno345pqr', name: 'Gingerlake View', image: restaurant_5 },
  { _id: 'stu678vwx', name: 'B Town Barbeque', image: restaurant_6 },
  { _id: 'yza901bcd', name: 'Omkar Grand', image: restaurant_7 },
  { _id: 'efg234hij', name: 'The Hangout', image: restaurant_8 },
  { _id: 'klm567opq', name: 'Full Circle', image: restaurant_9 },
  { _id: 'rst890uvw', name: 'Royal Andhra Spice', image: restaurant_10 },
];

import food_1 from './food_1.png'
import food_2 from './food_2.png'
import food_3 from './food_3.png'
import food_4 from './food_4.png'
import food_5 from './food_5.png'
import food_6 from './food_6.png'
import food_7 from './food_7.png'
import food_8 from './food_8.png'
import food_9 from './food_9.png'
import food_10 from './food_10.png'
import food_11 from './food_11.png'
import food_12 from './food_12.png'
import food_13 from './food_13.png'
import food_14 from './food_14.png'
import food_15 from './food_15.png'
import food_16 from './food_16.png'
import food_17 from './food_17.png'
import food_18 from './food_18.png'
import food_19 from './food_19.png'
import food_20 from './food_20.png'
import food_21 from './food_21.png'
import food_22 from './food_22.png'
import food_23 from './food_23.png'
import food_24 from './food_24.png'
import food_25 from './food_25.png'
import food_26 from './food_26.png'
import food_27 from './food_27.png'
import food_28 from './food_28.png'
import food_29 from './food_29.png'
import food_30 from './food_30.png'
import food_31 from './food_31.png'
import food_32 from './food_32.png'

import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'
import selector_icon from './selector_icon.png'
import rating_starts from './rating_starts.png'
import profile_icon from './profile_icon.png'
import bag_icon from './bag_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'

export const currency = '₹'
export const url = 'https://bytebun.onrender.com/'
export const assets = {
    logo,
    basket_icon,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon
}

export const menu_list = [
    {
        menu_name: "Biriyani",
        menu_image: menu_1
    },
    {
        menu_name: "Indian",
        menu_image: menu_2
    },
    {
        menu_name: "Italian",
        menu_image: menu_3
    },
    {
        menu_name: "Burgers",
        menu_image: menu_4
    },
    {
        menu_name: "Chinese",
        menu_image: menu_7
    },
    {
        menu_name: "South Indian",
        menu_image: menu_5
    },
    {
        menu_name: "Ice Creams",
        menu_image: menu_8
    },
    {
        menu_name: "Chaats",
        menu_image: menu_10
    },
    {
        menu_name: "Seafood",
        menu_image: menu_11
    },
    {
        menu_name: "Momos",
        menu_image: menu_12
    },
    {
        menu_name: "Beverages",
        menu_image: menu_14
    },
    {
        menu_name: "Meat",
        menu_image: menu_16
    },
    {
        menu_name: "Dessert",
        menu_image: menu_17
    }]

    export const food_list = [
        {
            _id: "1",
            name: "Paneer Tikka",
            image: food_1,
            price: 220,
            description: "Marinated paneer grilled to perfection, served with mint chutney.",
            category: "Tandoori"
        },
        {
            _id: "2",
            name: "Chicken Tandoori",
            image: food_2,
            price: 300,
            description: "Juicy and flavorful chicken cooked in a traditional tandoor.",
            category: ["Meat", "Tandoori"] 
        },
        {
            _id: "3",
            name: "Masala Dosa",
            image: food_3,
            price: 120,
            description: "Crispy rice crepe filled with spicy potato masala.",
            category: "South Indian"
        },
        {
            _id: "4",
            name: "Idli Sambar",
            image: food_4,
            price: 100,
            description: "Steamed rice cakes served with sambar and coconut chutney.",
            category: "South Indian"
        },
        {
            _id: "5",
            name: "Butter Chicken",
            image: food_5,
            price: 350,
            description: "A rich and creamy chicken curry cooked in a tomato-based gravy.",
            category: "Meat"
        },
        {
            _id: "6",
            name: "Dal Makhani",
            image: food_6,
            price: 240,
            description: "Slow-cooked black lentils with butter and cream.",
            category: "North Indian"
        },
        {
            _id: "7",
            name: "Hyderabadi Biryani",
            image: food_7,
            price: 300,
            description: "Aromatic rice cooked with spices and tender meat.",
            category: "Biryani"
        },
        {
            _id: "8",
            name: "Veg Pulao",
            image: food_8,
            price: 180,
            description: "Fragrant basmati rice cooked with mixed vegetables and spices.",
            category: "North Indian"
        },
        {
            _id: "9",
            name: "Pav Bhaji",
            image: food_9,
            price: 150,
            description: "Spiced vegetable mash served with buttered bread rolls.",
            category: "Pav Bhaji"
        },
        {
            _id: "10",
            name: "Chole Bhature",
            image: food_10,
            price: 200,
            description: "Spicy chickpea curry served with fluffy fried bread.",
            category: "North Indian"
        },
        {
            _id: "11",
            name: "Rasgulla",
            image: food_11,
            price: 100,
            description: "Soft and spongy cottage cheese balls soaked in sugar syrup.",
            category: "Desserts"
        },
        {
            _id: "12",
            name: "Gulab Jamun",
            image: food_12,
            price: 120,
            description: "Fried dough balls soaked in flavored sugar syrup.",
            category: "Desserts"
        },
        {
            _id: "13",
            name: "Pani Puri",
            image: food_13,
            price: 50,
            description: "Crispy hollow puris filled with tangy and spicy water.",
            category: "Snacks"
        },
        {
            _id: "14",
            name: "Kadai Paneer",
            image: food_14,
            price: 280,
            description: "Paneer cubes cooked with bell peppers in a spicy tomato-based gravy.",
            category: "North Indian"
        },
        {
            _id: "15",
            name: "Bhindi Masala",
            image: food_15,
            price: 200,
            description: "Stir-fried okra with spices and onions.",
            category: "North Indian"
        },
        {
            _id: "16",
            name: "Fish Curry",
            image: food_16,
            price: 320,
            description: "Traditional coastal fish curry with coconut and spices.",
            category: "Seafood"
        },
        {
            _id: "17",
            name: "Medu Vada",
            image: food_17,
            price: 120,
            description: "Crispy and savory lentil donuts served with chutney and sambar.",
            category: "South Indian"
        },
        {
            _id: "18",
            name: "Rajma Chawal",
            image: food_18,
            price: 180,
            description: "Red kidney beans cooked in a spiced gravy, served with steamed rice.",
            category: "North Indian"
        },
        {
            _id: "19",
            name: "Mutton Rogan Josh",
            image: food_19,
            price: 400,
            description: "Flavorful mutton curry cooked with aromatic spices.",
            category: "Meat"
        },
        {
            _id: "20",
            name: "Aloo Paratha",
            image: food_20,
            price: 80,
            description: "Stuffed Indian flatbread filled with spiced mashed potatoes.",
            category: "Parathas"
        },
        {
            _id: "21",
            name: "Hakka Noodles",
            image: food_21,
            price: 150,
            description: "Stir-fried noodles with vegetables and Indo-Chinese flavors.",
            category: "Chinese"
        },
        {
            _id: "22",
            name: "Spring Rolls",
            image: food_22,
            price: 140,
            description: "Crispy rolls filled with spiced vegetables or chicken.",
            category: "Chinese"
        },
        {
            _id: "23",
            name: "Dhokla",
            image: food_23,
            price: 100,
            description: "Steamed savory cake made from fermented rice and chickpea flour.",
            category: "Snacks"
        },
        {
            _id: "24",
            name: "Shahi Paneer",
            image: food_24,
            price: 280,
            description: "Paneer cubes cooked in a rich and creamy gravy with nuts.",
            category: "North Indian"
        }
    ];
    


export default assets
