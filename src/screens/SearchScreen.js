import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ToastAndroid, ActivityIndicator, Button, KeyboardAvoidingView, StatusBar } from 'react-native';
import SearchBar from '../Components/SearchBar';
import useResults from '../hooks/useResults';
import ResultsList from '../Components/ResultsList';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc,setDoc } from 'firebase/firestore';
import { signOut, getAuth, onAuthStateChanged} from 'firebase/auth';
import { auth, db } from '../firebase';
import { Feather } from '@expo/vector-icons';
import Filter from '../Components/filter'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import { selectOrigin } from '../../slices/navSlice';
import {useSelector} from "react-redux"
import * as RootNavigation from '../RootNavigation'
import Currentlocation from "../Components/Currentlocation"
import { Dimensions } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { useHeaderHeight } from 'react-navigation-stack';



let filterarray = [];
let sortarray = []
let filtered = null

const SearchScreen = ({route, navigation}) => {

    const origin = useSelector(selectOrigin)
    console.log(origin)
    //const [latitude, longitude, address] = Currentlocation();
    
    let updater = true
    const [term, setTerm] = useState('');
    const [value, setValue] = useState(0);
    const [isloading, setIsloading] = useState(false)
    //const [searchApi, results, errorMessage] = useResults();
    const [searchApi, results, results1, results2, errorMessage, needupdate, address, updatepredict] = useGooglePlaces1();
    console.log(address)
    const [results3, setResults3] = useState(results2)
    const [sentences, setSentences] = useState('')
    const [open, setOpen] = useState(false);
    const [value1, setValue1] = useState([]);
    const [items, setItems] = useState([
        { label: '$', value: 1 },
        { label: '$$', value: 2 },
        { label: '$$$', value: 3 },
        { label: '$$$$', value: 4 },
    ]);
    const [filterupdate, setFilterupdate] = useState(0)

    const price = (preference, results) => {
        var places = []
        for (var i = 0;(i < preference && i <results.therealarray.length);i += 1) {
            places.push(results.therealarray[i])
        }
        
        return places
    }

    const filterprice = (distancefilter, pricefilter, distance, recommend, results, preference) => {
        for (var i = 0; i < 60; i += 1) {
            filterarray.pop()
        }
        
        console.log("hellofku")
        //console.log(results)
        for (var i = 0; i < results.therealarray.length;i += 1) {
            if ((results.therealarray[i].distance < distancefilter) && (((pricefilter[results.therealarray[i].price_level - 1]) == true) || (pricefilter[0] == false && pricefilter[1] == false&&pricefilter[2]== false &&pricefilter[3]== false))) {
                filterarray.push(results.therealarray[i])
                console.log("REACHEDHERE")
            }
        }
        
        console.log("hello1")
        console.log(filterarray)
        if (distance == true) {
            for (var i = 0; i < filterarray.length;i += 1) {
                let closest = 100
                let count = i;
                for (var j = i; j < filterarray.length; j += 1) {
                    if (closest > filterarray[j].distance) {
                        closest = filterarray[j].distance
                        console.log("hello2")
                    console.log(filterarray[j].distance)
                        count = j
                    }                    
                }
                const temp = filterarray[i]
                filterarray[i] = filterarray[count]
                filterarray[count] = temp
                console.log(filterarray[i].distance)
                console.log(filterarray[count].distance)
                console.log(count)
                
            }
        }
        else if (recommend == true) {
            //console.log(filterarray)
            for (var i = 0; i < filterarray.length; i += 1) {
                if (filterarray[i].recommend !== true){
                    filterarray.splice(i,1)
                    i -= 1;
                }
            }
        }
        console.log('myfkingnameis =' + preference)
        var places = []
        for (var i = 0; (i < preference && i <filterarray.length);i += 1) {
            places.push(filterarray[i])
        }
        
        return places
    }


    console.log('lengthofarray= '+ results.fillthisarray.length)

    console.log(route)
   

    const ratedsentencefilter = (ratedsentence) => {
        const url = "https://sentences-27joodiwra-uc.a.run.app/filter"
        fetch(url, {
          method:'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body:JSON.stringify({'sentence':ratedsentence})
        }).then(res => res.json())
        .then(result => {
          console.log(result)
          for (var i = 0; i < result.sentence.length; i += 1) {
            if (result.sentence[i][1] < 3.65) {
              result.sentence.splice(i,1)
              i -= 1;
            }
          }
          
          //fillfilterarray.push(result)
          setSentences(result)
        })
      }
    
    useEffect(()=> {
        if (needupdate == true) {
            setIsloading(false)
            if (route.params === undefined) {
                var hello = {"therealarray":price(value, results2)}
                console.log("kekw")
                console.log(hello)
                setResults3(hello)
            }
            if (route.params !== undefined) {
                filtered=filterprice(route.params.distancefilter,route.params.pricefilter,route.params.sort,route.params.recommend, results2, value)
                var hello = {"therealarray":filtered}
                setResults3(hello)
            }
        }
        else if (needupdate == false) {
            console.log('wokwok')
            setResults3({"therealarray":[]})
        }
    }, [needupdate])
    
    useEffect(()=> {
        //setFilterupdate(filterupdate+1)
        if (route.params !== undefined) {
            filtered=filterprice(route.params.distancefilter,route.params.pricefilter,route.params.distance, route.params.recommend, results2, value)
            var hello = {"therealarray":filtered}
                setResults3(hello)
            //console.log(filtered)
        }
    }, [route.params])
/*
    useEffect(()=> {
        if (filtered !== null) {
        //console.log(results2)
        console.log("meowmeow")
        //console.log(results3)
        console.log({"therealarray":filtered})
        var hello = {"therealarray":filtered}
        setResults3(hello)
        }
    },[filtered])*/

    useEffect(() => {     

        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        const taskQuery = query(collection(db, "User", auth.currentUser.uid, 'Preference'));
        const taskQuery1 = query(collection(db, "User", auth.currentUser.uid, 'Rated Restaurants'))
    
        const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
            const tasks = [];
            snapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });
            console.log([...tasks])
            console.log(tasks)
            if (tasks.length == 0) {
                tasks.push({"desc": 5})
            }
            console.log(tasks)
            setValue([...tasks][0].desc)

            })

        const unsubscribe1 = onSnapshot(taskQuery1, (snapshot) => {
            const tasks = [];
            const array = [];
            snapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });
            for (var i = 0; i < tasks.length; i +=1 ) {
                array.push([tasks[i].sentence,tasks[i].rating, 1])
                console.log([tasks[i].sentence,tasks[i].rating, 1])
            }
            if (tasks.length==0) {
                setSentences({sentence:[]})
            }
            else {
            ratedsentencefilter(array)
            }
        })
        return (unsubscribe, unsubscribe1)
    }, []);

    const ErrorToast = () => {
        ToastAndroid.show(
            'No Search Results Near You',
            ToastAndroid.SHORT
        );
        errorMessage.error = false
    };

    const ShowActivity = () => {
        searchApi(term, true, value, sentences)
        setIsloading(true)
    }

    const originaddress = (string) => {
        console.log(string.length)
        var lowest = 40;
        const newstring = []
        if (lowest > string.length) {
            lowest = string.length
        }
        if (string.length > 40) {
            for (var i = 0; i < lowest; i += 1) {
                newstring.push(string[i])
            }
            newstring.push('...')
            console.log(newstring)
            return newstring
        }
        else return string
        
    }
    

    return (
        <View style = {{flex: 1}}>
            <StatusBar hidden={true}/>
            <KeyboardAvoidingView style = {styles.header}>
                <View style = {styles.icon}>
                    <TouchableOpacity onPress={()=> navigation.openDrawer()}>
                        <Feather name="menu" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    <View style={{flex:1.5}}>
                    <Text style={styles.headerText}>
                        {origin? originaddress(origin.address):"Please input address"}
                    </Text>
                    </View>
                    <View style={{flex:1, alignItems:'center', backgroundColor:'pink', borderRadius:10,}}>
                    <TouchableOpacity style={{flex:1, justifyContent:'center'}}onPress={()=>RootNavigation.navigate("Change Location")}>
                        <Text>
                            Change Address
                        </Text>
                    </TouchableOpacity>
                    </View>  
                </View>
            </KeyboardAvoidingView>
            <View style = {{flexDirection:'row'}}>
                <SearchBar
                    term={term} 
                    onTermChange={setTerm}
                    onTermSubmit={() => ShowActivity()}
                    needupdate={needupdate}
                    />
                    {route.params==undefined? <Filter undefined={true}/>: <Filter undefined={false} distancefilter={route.params.distancefilter} pricefilter={route.params.pricefilter} sort={route.params.sort} distance={route.params.distance} recommend={route.params.recommend}/>}
            </View>
                {((isloading == true) && (updatepredict == false)) ?
                <View style={{justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text>Getting reviews, Predicting ratings</Text>
                </View>
                : null}

                {((isloading == true) && (updatepredict == true)) ?
                <View style={{justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text>Predicting Ratings</Text>
                </View>
                : null} 
            
            
            {errorMessage.error? ErrorToast() : null}
                <ResultsList 
                    results={results3} 
                    title="All results" 
                />

            
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection:'row'
    },
    header: {
        width: '100%',
        height: ScreenHeight/13.5,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 12,
        justifyContent: 'center',
        //marginLeft:6
        
    },
    icon: {
        justifyContent:'space-around', 
        borderWidth:15, 
        borderColor:'white'
    },
    textContainer: {
        flex:1,
        justifyContent:'center', 
        alignItems:'center',
        flexDirection:'row',
        borderWidth:10, 
        borderColor:'white'
    }

});

export default SearchScreen;


