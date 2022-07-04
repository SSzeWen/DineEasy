import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView , FlatList, Image, TouchableOpacity} from 'react-native';
import yelp from '../api/yelp';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import {Google_apikey} from '@env'
import SaveRate from '../Components/SaveRate';
import * as RootNavigation from '../RootNavigation'


const ResultShowScreen = ({ route }) => {
    const [result, setResult] = useState(null);
    const id = route.params.id;
    const score = route.params.rating
    const sentence = route.params.sentence
    const coordinate = route.params.coordinate
    
    console.log(route)
    //console.log(id)
    
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
            res['score'] = score
            res['sentence'] = sentence
            setResult(res)

            //console.log(res)
        })
    }
    useEffect(()=> {
        getResult(id);
    }, []);

    //console.log(result)
    if (!result) {
        return null;
    } // not impt also not sure and line 26 also

    return (
        <View style = {{ flex: 1}}>
            <View style={styles.horizontalcontainer}>
            { result.result.formatted_address != null ? <Text style={{flex:3.5}}>{result.result.formatted_address}</Text> : null}
            <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=> RootNavigation.navigate("DirectionsAPI", {coordinate})}>
                <Text>Maps</Text>
            </TouchableOpacity>
            
            </View>
            <View style={{flex:15}}>
            <FlatList
                data={result.result.photos}
                keyExtractor={(photo) => photo.photo_reference}
                renderItem={({item}) => {
                    console.log(item)
                    return <Image style={styles.image} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + item.photo_reference + '&key=' + Google_apikey}} />
                }} />
            <SaveRate props={result}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        height: 200,
        width: 300
    },
    horizontalcontainer: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems:'center'
        
    }
});

export default ResultShowScreen;