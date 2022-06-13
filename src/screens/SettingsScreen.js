import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Spacer from '../Components/Spacer';
import { auth,db } from '../firebase';
import {Input, Button } from 'react-native-elements';
import * as RootNavigation from '../RootNavigation'
import { signOut, getAuth, onAuthStateChanged} from 'firebase/auth';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import { doc,setDoc } from 'firebase/firestore';




const SettingsScreen = () => {

    const RecPreference = async (instruction) => {
        try {
            const taskRef = await setDoc(doc(db, "User", auth.currentUser.uid, "Preference", "Recommended"), {
                desc: instruction,
            });
        } catch (err) {
            console.log('onSubmitHandler failure', err);
        }
    };

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
const [selectedLanguage, setSelectedLanguage] = useState();

    const LogoutHandler = () => {
        signOut(auth);
        return RootNavigation.navigate("Auth", {screen: "Login"})
    }
    return (
        <View style={{flex:1}}>
            <Text>SettingsScreen</Text>
            <Spacer/>
            <Text>Recommendation Preference</Text>
            <View style={styles.container}>
            </View>
            <Button title="1" onPress={()=>RecPreference(1)} />
                <Button title="3" onPress={()=>RecPreference(3)} />
            <Button title="Logout" onPress={LogoutHandler}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
    },
});

export default SettingsScreen;






