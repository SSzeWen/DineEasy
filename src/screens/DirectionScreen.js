import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView , FlatList, Image, TouchableOpacity} from 'react-native';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import {Google_apikey} from '@env'
import MapView, { Marker } from 'react-native-maps';
import Currentlocation from '../Components/Currentlocation';
import MapViewDirections from 'react-native-maps-directions';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../../slices/navSlice';
import openMap from 'react-native-open-maps';



const DirectionScreen = ({ route }) => {
    //const [originlatitude, originlongitude] =  Currentlocation();
    const origin = useSelector(selectOrigin)
    console.log(origin)
    const originlatitude = origin.latitude
    const originlongitude = origin.longitude
    console.log(route)
    const mapRef = useRef(null)
    const destination = route.params.coordinate

    useEffect(()=> {
       if((originlatitude === 1) || (originlongitude === 1)){
        return
       }
       console.log("meowmeowmeow")
       setTimeout(()=> {
        mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
            edgePadding: { top: 50, left: 50, right: 50, bottom: 50}
        });    
       },1000)
            
            console.log("meowmeow2")
    },[originlatitude,originlongitude,destination])


    return (

        <View style={{flex:1}}>
            <View style={{flex:14}}>
            {(originlatitude !== 1) && (originlongitude !== 1)? <MapView
            style={{flex:1}}
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
        >
            <Marker coordinate={{latitude: originlatitude, longitude: originlongitude}} pinColor="blue" title="Origin"
            identifier="origin"/>
            <Marker coordinate={destination} title="Destination" identifier="destination"></Marker>
            <MapViewDirections
                origin={{latitude: originlatitude,
                    longitude: originlongitude,}}
                destination={destination}
                apikey={Google_apikey}
                strokeWidth={3}
                strokeColor="hotpink"
                mode="WALKING"
            />
            
        </MapView> : null}
            </View>
            <View style={{flex:1, backgroundColor:'pink', justifyContent:'center', alignItems:'center', borderRadius:20, width:'50%', alignSelf:'center',}}>
                <TouchableOpacity onPress={()=>openMap({start:String(originlatitude)+","+ String(originlongitude), 
                                                    end: String(destination['latitude'])+"," + String(destination['longitude']),
                                                    travelType: "walk"})}>
                    <Text>Open in Google Maps</Text>
                </TouchableOpacity>
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

export default DirectionScreen;