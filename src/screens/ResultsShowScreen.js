import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView , FlatList, Image, TouchableOpacity} from 'react-native';
import yelp from '../api/yelp';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import {Google_apikey} from '@env'
import SaveRate from '../Components/SaveRate';
import * as RootNavigation from '../RootNavigation'
import { Dimensions } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


const ResultShowScreen = ({ route }) => {
    const [result, setResult] = useState(null);
    const id = route.params.id;
    const score = route.params.rating
    const sentence = route.params.sentence
    const coordinate = route.params.coordinate
    const placename = route.params.name
    console.log(coordinate)
    
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
            
            <View style={{flex:5, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
            <FlatList
                
                data={result.result.photos}
                keyExtractor={(photo) => photo.photo_reference}
                horizontal={true}
                pagingEnabled={true}
                scrollEnabled={true}
                //showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                decelerationRate={"fast"}
                renderItem={({item}) => {
                    console.log(item)
                    return (
                    <View style={{flex:1}}><Image style={styles.image} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + item.photo_reference + '&key=' + Google_apikey}} />
                    <Text style={{flex:.02}}></Text></View>)
                }} />
            
            </View>
            <View style={{flex:1, justifyContent:'center', marginLeft:'3%', marginRight:'10%', marginVertical:'3%'}}>
                <Text style={{fontWeight:'bold', fontSize:17}}>
                    {placename}
                </Text>

            </View>
            <View style={styles.horizontalcontainer}>
                <View style={{flex:4}}>
                <View style={{flex:1,flexDirection:'row', alignItems:'center', justifyContent:'center',marginLeft:4}}>
            <AntDesign name="star" size={24} color="orange" />
            { score != null ? <Text style={{flex:1,fontSize:15,marginLeft:5}}> {Math.round(score)}</Text> : null}
            </View>
                    <View style={{flex:1,flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <EvilIcons name="location" size={30} color="red"/>
            { result.result.formatted_address != null ? <Text style={{flex:1,fontSize:15,marginLeft:5}}>{result.result.formatted_address}</Text> : null}
            </View>
            
            </View>
            <TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center', borderLeftWidth:1}} onPress={()=> RootNavigation.navigate("DirectionsAPI", {coordinate})}>
            <MaterialIcons name="directions" size={30} color="green" />
            </TouchableOpacity>
            
            </View>
            <View style={{flex:.5}}></View>
            <View style={{flex:6}}>
                
            <MapView
            style={{flex:1}}
            initialRegion={{
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
        >
            <Marker coordinate={coordinate} title="Destination" identifier="destination"></Marker>            
        </MapView>
            </View>
            <SaveRate props={result}/>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        flex:1,
        //width:'100%'
        height: '100%',
        //borderRadius:20,
        width: ScreenWidth -12,
        marginHorizontal:6
        //marginBottom:3,
    },
    horizontalcontainer: {
        flex: 2,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems:'center',
        marginLeft:6
        
    }
});

export default ResultShowScreen;