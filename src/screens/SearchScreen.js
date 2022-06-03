import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SearchBar from '../Components/SearchBar';
import yelp from '../api/yelp';
import useResults from '../hooks/useResults';
import ResultsList from '../Components/ResultsList';
import useGooglePlaces1 from '../Components/useGooglePlaces1';

const SearchScreen = () => {
    const [term, setTerm] = useState('');
    //const [searchApi, results, errorMessage] = useResults();
    const [searchApi, results, errorMessage] = useGooglePlaces1();


    /*const filterResultsByPrice = (price) => {
        return results.filter(result => {
            return result.price === price;
        })
    };*/
    
    //console.log(results)
    console.log('lengthofarray= '+ results.fillthisarray.length)

    return (
        <View style = {{ flex: 1}}>
            <SearchBar 
                term={term} 
                onTermChange={setTerm}
                onTermSubmit={() => searchApi(term, true)}
                />
            {errorMessage? <Text>{errorMessage}</Text> : null}
                <ResultsList 
                    results={results} 
                    title="All results" 
                />
        </View>
        
    );
};

const styles = StyleSheet.create({});

export default SearchScreen;