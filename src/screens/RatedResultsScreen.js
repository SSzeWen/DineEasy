import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db , auth} from '../firebase';
import {Google_apikey} from '@env'

const RatedResultsScreen = () => {
    const [taskList, setTaskList] = useState([]);

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    const onDeleteHandler = async (id) => {
        try {
            await deleteDoc(doc(db, 'User', auth.currentUser.uid, 'Rated Restaurants', id ));

            console.log('onDeleteHandler success', id);
            showRes('Successfully deleted task!');
        } catch (err) {
            console.log('onDeleteHandler failure', err);
            showRes('Failed to delete task!');
        }
    };

    useEffect(() => {
        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        const taskQuery = query(collection(db, "User", auth.currentUser.uid, 'Rated Restaurants'));

        const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
            const tasks = [];

            snapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });

            console.log([...tasks])
            setTaskList([...tasks]);
            console.log(taskList)
        });
        

        return unsubscribe;
    }, []);
    return (
        <View>
            <Text>RatedResultsScreen</Text>
            <FlatList
            data={taskList}
            keyExtractor={(result) => result.id}
            renderItem={({ item }) => {

                
                if (item.desc != undefined) {
                return(
                    <View style={styles.container}>
                    <Image style={styles.image} source={ { uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + item.photo_reference + '&key=' + Google_apikey} } />
                    <Text>{item.desc}</Text>
                    <Text>ratings: {item.rating}</Text>
                    <TouchableOpacity onPress={()=> {onDeleteHandler(item.id)}}>
                        <Text>Delete</Text>
                    </TouchableOpacity>
                    </View>

                    

                )
                }

            }}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        marginLeft: 0
    },
    image: {
        width: 400,
        height: 200,
        borderRadius: 4,
        marginBottom: 5
    },
    name: {
        fontWeight: 'bold',
    },
});

export default RatedResultsScreen;