import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Spacer from '../Components/Spacer';
import { auth, db } from '../firebase';
import {Input, Button } from 'react-native-elements';
import * as RootNavigation from '../RootNavigation'
import { query, collection, onSnapshot, addDoc, deleteDoc, doc,setDoc } from 'firebase/firestore';
import { signOut, getAuth, onAuthStateChanged} from 'firebase/auth';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import RNPickerSelect from 'react-native-picker-select';





const SettingsScreen = () => {

    const RecPreference = async (instruction) => {
        let name = ''
        if (instruction == 1) {
            name = '1 Restaurant'
        }
        if (instruction == 3) {
            name = '3 Restaurant'
        }
        if (instruction == null) {
            return
        }
        try {
            const taskRef = await setDoc(doc(db, "User", auth.currentUser.uid, "Preference", "Recommended"), {
                desc: instruction,
                name: name,
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

const[taskList, setTaskList] = useState()

useEffect(() => {
    // Expensive operation. Consider your app's design on when to invoke this.
    // Could use Redux to help on first application load.
    const taskQuery = query(collection(db, "User", auth.currentUser.uid, 'Preference'));

    const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
        const tasks = [];

        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });

        console.log([...tasks])
        setTaskList([...tasks]);
        setPlaceholderrecommendation([...tasks][0].name)
    });
    

    return unsubscribe;
}, []);

const [selectedLanguage, setSelectedLanguage] = useState();

    const LogoutHandler = () => {
        signOut(auth);
        return RootNavigation.navigate("Auth", {screen: "Login"})
    }

    const [placeholderrecommendation, setPlaceholderrecommendation] = useState('')




    return (
        <View style={{flex:1}}>
            <Text>SettingsScreen</Text>
            <Spacer/>
            <Text>Recommendation Preference</Text>
            <RNPickerSelect
            onValueChange={(value) => RecPreference(value)}
            items={[
                { label: '1 Restaurant', value: 1 },
                { label: '3 Restaurant', value: 3 },
            ]}
            placeholder={{//label: "Current: " + placeholderrecommendation, value:null , color: '#9EA0A4'
            }}
        />
            <View style={styles.container}>
            </View>
            
            <Button title="Logout" onPress={LogoutHandler}/>
        </View>
    );
};

/*<Button title="1" onPress={()=>RecPreference(1)} />
                <Button title="3" onPress={()=>RecPreference(3)} />*/
const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
    },
});

export default SettingsScreen;






