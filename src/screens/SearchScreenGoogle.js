import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import SearchBar from '../Components/SearchBar';
import useResults from '../hooks/useResults';
import ResultsList from '../Components/ResultsList';
import { setGoogleApiKey } from 'expo-location';
import {Google_apikey} from '@env'

const SearchScreenGoogle = () => {
    const [term, setTerm] = useState('');
    //const [searchApi, results, errorMessage] = useResults();

    /*const filterResultsByPrice = (price) => {
        return results.filter(result => {
            return result.price === price;
        })
    };
    

    return (
        <View style = {{ flex: 1}}>
            <SearchBar 
                term={term} 
                onTermChange={setTerm}
                onTermSubmit={() => searchApi(term)}
                />
            {errorMessage? <Text>{errorMessage}</Text> : null}
                <ResultsList 
                    results={results} 
                    title="All results" 
                />
        </View>
        
    );*/
    const photoreference = "Aap_uEDNlDjLG2U8pOzr9UKHxZ7pE9EaYA44jBxWWfDPRW0djIryH4YXSTPKwRM3y7RMZ8ZfBvK-lv2zhe9JVtITokq_PbubLybHeZ8TDwUezi7gpVByEhlQVQ0YHVzJyQJbNy_bIG_70vP__pvp0l-gHdXomNDI4sfa6hjX22v8brnevxqG"
    const url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + photoreference + '&key=' + Google_apikey
    

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: url }}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 15
    },
    image: {
        width: 400,
        height: 200,
        borderRadius: 4,
        marginBottom: 5
    },
    name: {
        fontWeight: 'bold',
    },

});

export default SearchScreenGoogle;