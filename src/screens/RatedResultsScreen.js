import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db , auth} from '../firebase';
import {Google_apikey} from '@env'
import { hasServicesEnabledAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';



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
        <View style={{flex:1}}>
            <FlatList
            data={taskList}
            keyExtractor={(result) => result.id}
            renderItem={({ item }) => {
                if (item.desc != undefined) {
                return(
                    <View style={styles.container}>
                        <View style={styles.container1}>
                            {item.photo_reference==null?<Image style={styles.image} source={require('../Components/Blank.jpeg')}/>:
                            <Image style={styles.image} source={ { uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + item.photo_reference + '&key=' + Google_apikey} } />}
                            <View style={styles.container2}>
                                <View style={{flex:2, marginTop:8}}>
                                    <Text style={{fontWeight: 'bold', fontSize:17}}>{item.desc}</Text>
                                </View>
                                <View style={{flex:1}}>
                                <Text style={{fontSize:14}}>{item.time}</Text>
                                </View>
                            
                            </View>
                        </View>
                        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start',alignItems:'center',marginHorizontal:15}}>
                        <Text style={{flex:1,fontWeight: 'bold', fontSize:15}}>Ratings: {item.rating}</Text>
                        <View style={{flex:1,justifyContent:'center', marginVertical:6}}>
                        <TouchableOpacity style={styles.delete} onPress={()=> {onDeleteHandler(item.id)}}>
                                <Text style={{fontWeight: 'bold', fontSize:15}}>Remove Rating</Text>
                        </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                )
                }

            }
        }
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex:1,
        /*borderTopWidth:3,
        borderLeftWidth:3,
        borderRightWidth:3,
        borderBottomWidth:1.5,
        borderColor: '#ecbeb4',*/
        backgroundColor:'white',
        marginHorizontal:20,
        marginVertical:15,
        borderRadius:15,
        width: '90%',
        height: 200,
        justifyContent:'center',
    },
    container1:{
        flex:3,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginHorizontal:15,
        marginTop:17
    },
    container2:{
        flex:1.5,
        marginLeft:10,
    },
    delete:{
        flex:1,
        backgroundColor:'#ecbeb4',
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        borderRadius:10,
    },
    image: {
        flex:1.1,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        marginBottom: 0,
        resizeMode:'cover'
    },
    name: {
        fontWeight: 'bold',
    },
});

export default RatedResultsScreen;

/*<View style={styles.container1}>
                            <Image style={styles.image} source={ { uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + item.photo_reference + '&key=' + Google_apikey} } />
                            <TouchableOpacity style={styles.container2} onPress={()=> {onDeleteHandler(item.id)}}>
                                <MaterialIcons name="delete" size={35} color="#000000" />
                            </TouchableOpacity>
                            
                        </View>
                        <View style={styles.container3}>
                            <Text style={{flex:1,fontWeight: 'bold',}}>{item.desc}</Text>
                            <Text style={{flex:1,fontWeight: 'bold',}}>Ratings: {item.rating}</Text> 
                        </View>   */