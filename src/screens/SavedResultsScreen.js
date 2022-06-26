import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db , auth} from '../firebase';
import {Google_apikey} from '@env';
import { MaterialIcons } from '@expo/vector-icons';


const SavedResultsScreen = () => {

    const [taskList, setTaskList] = useState([]);

    const onDeleteHandler = async (id) => {
        try {
            await deleteDoc(doc(db, 'User', auth.currentUser.uid, 'Saved Restaurants', id ));

            console.log('onDeleteHandler success', id);
            showRes('Successfully deleted task!');
        } catch (err) {
            console.log('onDeleteHandler failure', err);
            showRes('Failed to delete task!');
        }
    };

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    useEffect(() => {
        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        const taskQuery = query(collection(db, "User", auth.currentUser.uid, 'Saved Restaurants'));

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
            <FlatList
            data={taskList}
            keyExtractor={(result) => result.desc}
            renderItem={({ item }) => {

                if (item.desc != undefined){
                return(
                    <View style={styles.container}>
                        <View style={styles.container1}>
                            <Image style={styles.image} source={ { uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + item.photo_reference + '&key=' + Google_apikey} } />
                            <TouchableOpacity style={styles.container2} onPress={()=> {onDeleteHandler(item.id)}}>
                                <MaterialIcons name="delete" size={35} color="#000000" />
                            </TouchableOpacity>
                            
                        </View>
                        <View style={styles.container3}>
                            <Text style={{flex:1,fontWeight: 'bold',}}>{item.desc}</Text>
                        </View>                    
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
        flex:1,
        marginLeft: 0,
        borderTopWidth:3,
        borderLeftWidth:3,
        borderRightWidth:3,
        borderBottomWidth:1.5,
        borderColor: '#A7DFA7',
        width: '100%',
        height: 250
    },
    container1:{
        flex:9,
        width:'100%',
        height:'100%',
        flexDirection: 'row',
        borderBottomWidth:3,
        borderColor:'#A7DFA7'
    },
    container2:{
        width:'20%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    container3:{
        flex:1,
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent:'center',
        alignItems:'center'
    },
    image: {
        width: '80%',
        height: '100%',
        borderRadius: 4,
        marginBottom: 5
    },
    name: {
        fontWeight: 'bold',
    },

});

export default SavedResultsScreen;