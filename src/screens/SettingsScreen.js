import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Spacer from '../Components/Spacer';
import { auth } from '../firebase';
import {Input, Button } from 'react-native-elements';
import * as RootNavigation from '../RootNavigation'
import { signOut, getAuth, onAuthStateChanged} from 'firebase/auth';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';


const SettingsScreen = () => {

    //const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
    console.log('signed in' + user.uid)
  } else {
      
  }
});

    const LogoutHandler = () => {
        signOut(auth);
        return RootNavigation.navigate("Auth", {screen: "Login"})
    }
    return (
        <View>
            <Text>SettingsScreen</Text>
            <Spacer/>
            <Button title="Logout" onPress={LogoutHandler}/>
        </View>
    );
};

const styles = StyleSheet.create({});

export default SettingsScreen;






