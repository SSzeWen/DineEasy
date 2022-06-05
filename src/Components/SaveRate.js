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

const SaveRate = ({props}) => {
    const [restaurant_id, photo_reference] = props
    const [task, setTask] = useState('');
    const [taskList, setTaskList] = useState([]);

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    const onSubmitHandler = async (instruction) => {
        console.log(restaurant_id)
        setTask(restaurant_id)
        if (task.length === 0) {
            showRes('Task description cannot be empty!');
            return;
        }

        try {
            const taskRef = await setDoc(doc(db, "User", auth.currentUser.uid, instruction, task), {
                desc: task,
                completed: false,
                photo_reference: photo_reference,
            });

            //console.log('onSubmitHandler success', taskRef.id);
            showRes('Successfully added task!');
        } catch (err) {
            console.log('onSubmitHandler failure', err);
            showRes('Failed to add task!');
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
                onPress={()=> RootNavigation.navigate("Rating", {restaurant_id, photo_reference})}
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
        backgroundColor: '#42f548',
        marginVertical: 10,
        paddingVertical: 10,
        width: '40%',
        alignItems: 'center',
        borderRadius: 10,
    },
    Ratebutton: {
        backgroundColor: '#f54275',
        marginVertical: 10,
        paddingVertical: 10,
        width: '40%',
        alignItems: 'center',
        borderRadius: 10,
    }
});

export default SaveRate;