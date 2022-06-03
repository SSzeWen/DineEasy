import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView , FlatList, Image} from 'react-native';
import yelp from '../api/yelp';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import {Google_apikey} from '@env'

const ResultShowScreen = ({ route }) => {
    const [result, setResult] = useState(null);
    const {id} = route.params;
    console.log(route)
    console.log(id)
    
    //console.log(result.location.address1);

    /*
    const getResult = async (id) => {
        const response = await yelp.get(`/${id}`);
        setResult(response.data);
    };
*/

    const getResult = async(id) => {
        var url =  'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + id + '&fields=name%2Cformatted_address%2Cprice_level%2Cphotos&key=' + Google_apikey
        console.log(url)
        await fetch(url).then(res=> {
            return res.json()
        }).then(res=> {
            setResult(res)
        })
    }
    useEffect(()=> {
        getResult(id);
    }, []);

    console.log(result)
    if (!result) {
        return null;
    } // not impt also not sure and line 26 also

    return (
        <View>
            { result.result.formatted_address != null ? <Text>{result.result.formatted_address}</Text> : null} 
            <FlatList
                data={result.result.photos}
                keyExtractor={(photo) => photo.photo_reference}
                renderItem={({item}) => {
                    console.log(item)
                    return <Image style={styles.image} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + item.photo_reference + '&key=' + Google_apikey}} />
                }} />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        height: 200,
        width: 300
    }
});

export default ResultShowScreen;