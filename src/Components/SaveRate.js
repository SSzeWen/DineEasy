import React from 'react';
import { View, TextInput, StyleSheet, Pressable , Text} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-web';
import * as RootNavigation from '../RootNavigation'
import { query, collection, onSnapshot, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { set } from 'react-native-reanimated';
import { auth } from '../firebase';
import { Alert } from 'react-native';
import { Input } from 'react-native-elements';

const SaveRate = ({props}) => {
    const result = props
    const photo_reference = result.result.photos[0].photo_reference
    const restaurant_id = result.result.name
    const score = result.score
    let sentence = result.sentence
    if (sentence == undefined) {
        sentence = result.result.name
    }
    console.log(result)
    
    const [task, setTask] = useState('');
    const [taskList, setTaskList] = useState([]);

    const getCurrentDate=()=>{

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
    
        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        return date + '-' + month + '-' + year;//format: dd-mm-yyyy;
    }

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    const onSubmitHandler = async (instruction) => {
        /*console.log(restaurant_id)
        setTask(restaurant_id)
        if (task.length === 0) {
            showRes('Task description cannot be empty!');
            return;
        }*/

        try {

            const taskRef = await setDoc(doc(db, "User", auth.currentUser.uid, instruction, restaurant_id), {
                desc: restaurant_id,
                completed: false,
                photo_reference: photo_reference,
                score: score,
                sentence: sentence,
                time: getCurrentDate(),

            });

            //console.log('onSubmitHandler success', taskRef.id);
            showRes('Successfully added Restaurant!');
        } catch (err) {
            console.log('onSubmitHandler failure', err);
            showRes('Failed to add Restaurant!');
        }
        return RootNavigation.navigate("Main", {screen: "Saved Restaurants"})
    };

    return (
        <View style={styles.backgroundStyle}>
            <Pressable style={styles.Savebutton}
                onPress={()=> onSubmitHandler("Saved Restaurants")}
                android_ripple={{ color: '#FFF' }}>
                <Text style={{fontSize:20}}>Save</Text>
            </Pressable>
            <Pressable style={styles.Ratebutton}
                onPress={()=> RootNavigation.navigate("Rating", {restaurant_id, photo_reference, score, sentence})}
                android_ripple={{ color: '#FFF' }}>
                <Text style={{fontSize:20}}>Rate</Text>
            </Pressable>                         
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundStyle: {
       // marginTop: 10,
        backgroundColor: '#F0EEEE',
        //backgroundColor: '#000000',
        height: 70,
        //borderRadius: 5,
        //marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-around'
        //marginBottom: 10
    },
    inputStyles: {
        flex: 1,
        fontSize: 18
    },
    Savebutton: {
        backgroundColor: '#A7DFA7',
        marginVertical: 10,
        paddingVertical: 10,
        width: '40%',
        alignItems: 'center',
        borderRadius: 10,
    },
    Ratebutton: {
        backgroundColor: '#ecbeb4',
        marginVertical: 10,
        paddingVertical: 10,
        width: '40%',
        alignItems: 'center',
        borderRadius: 10,
    }
});

export default SaveRate;