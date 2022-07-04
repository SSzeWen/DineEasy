import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import SearchBar from '../Components/SearchBar';
import yelp from '../api/yelp';
import useResults from '../hooks/useResults';
import ResultsList from '../Components/ResultsList';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc,setDoc } from 'firebase/firestore';
import { signOut, getAuth, onAuthStateChanged} from 'firebase/auth';
import { auth, db } from '../firebase';
import Spacer from '../Components/Spacer';
import { AntDesign } from '@expo/vector-icons';
import Filter from '../Components/filter'; 


let filterarray = [];
let sortarray = []
let filtered = null

const SearchScreen = ({route}) => {

    const filterprice = (distancefilter, pricefilter, sort, results) => {
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
        if (sort == false) {
            
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
        return filterarray
    }

    
    let updater = true
    const [term, setTerm] = useState('');
    const [value, setValue] = useState(0);
    const [isloading, setIsloading] = useState(false)
    //const [searchApi, results, errorMessage] = useResults();
    const [searchApi, results, results1, results2, errorMessage, needupdate] = useGooglePlaces1();
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
    console.log('lengthofarray= '+ results.fillthisarray.length)
    if (route.params !== undefined) {
        filtered=filterprice(route.params.distancefilter,route.params.pricefilter,route.params.sort, results2)
        console.log(filtered)
    }
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
            if (result.sentence[i][1] < 3.5) {
              result.sentence.splice(i,1)
            }
          }
          
          //fillfilterarray.push(result)
          setSentences(result)
        })
      }
    
    useEffect(()=> {
        if (needupdate == true) {
            setIsloading(false)
        }
    }, [needupdate])

    useEffect(()=> {
        setFilterupdate(filterupdate+1)
    }, [route.params])

    useEffect(()=> {
        if (filtered !== null) {
        console.log(results2)
        console.log("meowmeow")
        console.log(results3)
        console.log({"therealarray":filtered})
        var hello = {"therealarray":filtered}
        setResults3(hello)
        }
    },[filtered])

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

    return (
        <View style = {{flex: 1}}>
            <View style = {{flexDirection:'row'}}>
                <SearchBar
                    term={term} 
                    onTermChange={setTerm}
                    onTermSubmit={() => ShowActivity()}
                    />
                    {route.params==undefined? <Filter undefined={true}/>: <Filter undefined={false} distancefilter={route.params.distancefilter} pricefilter={route.params.pricefilter} sort={route.params.sort}/>}

                
            </View>
                {isloading?
                <View style={{justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text>Getting reviews, Predicting ratings</Text>
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
    }
});

export default SearchScreen;


/*<RNPickerSelect
            style={{width: '20%', height:'20%'}}
            onValueChange={(value) => console.log(value)}
            items={[
                { label: 'All', value: 0 },
                { label: '$', value: 1 },
                { label: '$$', value: 2 },
                { label: '$$$', value: 3 },
                { label: '$$$$', value: 4 },

            ]}
            placeholder={{//label: "Current: " + placeholderrecommendation, value:null , color: '#9EA0A4'
            }}
            />*/
/*
            <DropDownPicker
            multiple={true}
            min={0}
            max={5}
            open={open}
            value={value1}
            items={items}
            setOpen={setOpen}
            setValue={setValue1}
            setItems={setItems}
            containerStyle={{width:'30%', marginLeft:'5%'}}
            placeholder={'Price'}
            />*/