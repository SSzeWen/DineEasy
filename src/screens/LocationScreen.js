import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView , FlatList, Image, TouchableOpacity, KeyboardAvoidingView, Alert} from 'react-native';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import {Google_apikey} from '@env'
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../../slices/navSlice';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as RootNavigation from '../RootNavigation'
import { setOrigin } from '../../slices/navSlice';
import { useDispatch } from 'react-redux';
import { Value } from 'react-native-reanimated';


const LocationScreen = () => {
    const origin = useSelector(selectOrigin)
    console.log(origin)
    const dispatch = useDispatch();

    const [originlatitude, setOriginlatitude] = useState(1.4304)
    const [originlongitude, setOriginlongitude] = useState(103.8354)

    const mapRef = useRef(null)

 


    useEffect(()=> {
       if (origin!==null) {
        setOriginlatitude(origin.latitude)
        setOriginlongitude(origin.longitude)
        let region={latitude:originlatitude,longitude:originlongitude,latitudeDelta: 0.005,longitudeDelta:0.005}
       console.log("meowmeowmeow")
       setTimeout(()=> {
        //mapRef.current.fitToSuppliedMarkers(["origin"]);
        mapRef.current.animateToRegion(region,1000)
            
        },1000)
    }
            console.log("meowmeow2")
    },[originlatitude,originlongitude])


    return (

        <View style={{flex:1, backgroundColor:'white'}}>
            <GooglePlacesAutocomplete

            styles={{
                container:{
                    flex:0
                },
                textInput:{
                    height:50,
                    backgroundColor:'#D3D3D3',
                }
            }}
                placeholder='Input Location'
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                    dispatch(setOrigin({
                        latitude:details.geometry.location.lat,
                        longitude:details.geometry.location.lng,
                        address:details.formatted_address,
                      }))
                      setOriginlatitude(details.geometry.location.lat)
                      setOriginlongitude(details.geometry.location.lng)

                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                query={{
                    key: Google_apikey,
                    language: 'en',
                    components:'country:sg'
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
            />

            {(originlatitude !== 1) && (originlongitude !== 1)? <MapView
            style={{flexGrow:1}}
            ref={mapRef}
            initialRegion={{
                latitude: originlatitude,
                longitude: originlongitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            userLocationUpdateInterval={10}
            userLocationFastestInterval={10}
            onPoiClick={(data) => {
                const latitude = data.nativeEvent.coordinate.latitude
                const longitude = data.nativeEvent.coordinate.longitude
                const address = data.nativeEvent.name
                console.log(latitude)
                console.log(longitude)
                Alert.alert(
                    "Positioning",
                    "Set " + data.nativeEvent.name + " as your position?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => {
                        console.log("OK Pressed")
                        dispatch(setOrigin({
                            latitude:latitude,
                            longitude:longitude,
                            address:address,
                          }))
                          setOriginlatitude(latitude)
                          setOriginlongitude(longitude)
                    
                    } }
                    ]
                  );
                console.log(data.nativeEvent)
            }}
        >
            <Marker coordinate={{latitude: originlatitude, longitude: originlongitude}} pinColor="blue" title="Origin"
            identifier="origin"/>
            
        </MapView> : null}

            <TouchableOpacity style={[styles.container, {backgroundColor:'pink'}]} onPress={()=> RootNavigation.navigate("Search")}>
                    <Text style={{fontWeight: 'bold'}}>
                        Return to Home Screen
                    </Text>
                </TouchableOpacity>

            
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
        
    },
    container: {
        //flex:1,
        flexBasis:'6%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        marginHorizontal:8,
        marginVertical:5
        
    },
});

export default LocationScreen;