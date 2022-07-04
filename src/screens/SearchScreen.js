import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import SearchBar from '../Components/SearchBar';
import yelp from '../api/yelp';
import useResults from '../hooks/useResults';
import ResultsList from '../Components/ResultsList';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc,setDoc } from 'firebase/firestore';
import { signOut, getAuth, onAuthStateChanged} from 'firebase/auth';
import { auth, db } from '../firebase';
import Spacer from '../Components/Spacer';
import RNPickerSelect from 'react-native-picker-select';

let filterarray = [];

const filterprice = () => {

}

const SearchScreen = () => {
    const [term, setTerm] = useState('');
    const [value, setValue] = useState(0)
    //const [searchApi, results, errorMessage] = useResults();
    const [searchApi, results, results1, results2, errorMessage, needupdate] = useGooglePlaces1();
    const [results3, setResults3] = useState(results2)
    const [sentences, setSentences] = useState('')
    console.log('lengthofarray= '+ results.fillthisarray.length)

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

    return (
        <View style = {{ flex: 1}}>
            <SearchBar 
                term={term} 
                onTermChange={setTerm}
                onTermSubmit={() => searchApi(term, true, value, sentences)}
                />
            
            {errorMessage.error? ErrorToast() : null}
                <ResultsList 
                    results={results3} 
                    title="All results" 
                />
                
        </View>
        
    );
};

const styles = StyleSheet.create({});

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