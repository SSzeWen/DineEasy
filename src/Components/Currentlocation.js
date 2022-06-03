import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

const Currentlocation = () => {
    //const [location, setLocation] = useState(null);
    //const [errorMsg, setErrorMsg] = useState(null);
    const [lat, setLat] = useState(1);
    const [long, setLong] = useState(1);
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          //setErrorMsg('Permission to access location was denied');
          console.log('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        //setnewLocation(location);
        console.log(location);
        setLat(location.coords.latitude);
        setLong(location.coords.longitude);

      })();
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
    
    return[lat, long];
  }

  export default Currentlocation;