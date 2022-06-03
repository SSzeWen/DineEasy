import React, { useState, useEffect } from 'react';
import yelp from '../api/yelp';
import Currentlocation from '../Components/Currentlocation';

export default () => {
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [lat, long] = Currentlocation();
    console.log(lat);
    console.log(long);

    const searchApi= async (searchTerm) => {
        try {
            const response = await yelp.get('/search', {
                params: {
                    limit: 50,
                    term: searchTerm,
                    latitude: lat,
                    longitude: long,
                    //location: 'Clementi',
                    radius: 1000
                }
            });
            setResults(response.data.businesses);
        } catch (err) {
            setErrorMessage('Something went wrong');
        }
        
    };

    useEffect(() => {
        searchApi('pasta')
    }, []);

    return [searchApi, results, errorMessage];
}