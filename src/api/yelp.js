import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.yelp.com/v3/businesses',
    headers: {
        Authorization: 
        'Bearer zXZ3dwqSW1vTgWsojxFf1mJ0hX_Qfcdvh25b7MrHDSRj8nF9mecMn3z2CDMXQ0BPJe1lj0wudjWRoO9GsU2feyY6k545IWlQJkthesgxXkF0rpelvOo68p3PgtR8YnYx'

    }
});

