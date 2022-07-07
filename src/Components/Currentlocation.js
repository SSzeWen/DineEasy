import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import {Google_apikey} from "@env"
import { setOrigin } from '../../slices/navSlice';
import { useDispatch } from 'react-redux';

const Currentlocation = () => {
    //const [location, setLocation] = useState(null);
    //const [errorMsg, setErrorMsg] = useState(null);
    const [lat, setLat] = useState(1);
    const [long, setLong] = useState(1);
    const [address, setAddress] = useState('')

    const dispatch = useDispatch();
    
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          //setErrorMsg('Permission to access location was denied');
          console.log('Permission to access location was denied');
          /*dispatch(setOrigin({
            latitude:1,
            longitude:1,
            address:null,
          }))*/
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        //setnewLocation(location);
        console.log(location);
        setLat(location.coords.latitude);
        setLong(location.coords.longitude);
        const geocodereverseurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location.coords.latitude
    + "%2C" + location.coords.longitude +"&key=" + Google_apikey
          await fetch(geocodereverseurl).then(res => res.json())
        .then(response => {
          //console.log(response.results[0])
          setAddress(response.results[0].formatted_address)
          //console.log(response.results[0].formatted_address)
          console.log("rerenders here")
          dispatch(setOrigin({
            latitude:location.coords.latitude,
            longitude:location.coords.longitude,
            address:response.results[0].formatted_address,
          }))
        })
        }

      )();
    }, []);
    
    /*let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }
    
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );*/
    //return(location);
    //return (newlocation.coords.latitude, newlocation.coords.longitude);
    
    return[lat, long, address];
  }

  export default Currentlocation;