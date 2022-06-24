import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SearchBar from '../Components/SearchBar';
import yelp from '../api/yelp';
import useResults from '../hooks/useResults';
import ResultsList from '../Components/ResultsList';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc,setDoc } from 'firebase/firestore';
import { signOut, getAuth, onAuthStateChanged} from 'firebase/auth';
import { auth, db } from '../firebase';

const SearchScreen = () => {
    const [term, setTerm] = useState('');
    const [value, setValue] = useState(0)
    //const [searchApi, results, errorMessage] = useResults();
    const [searchApi, results, results1, results2, errorMessage, needupdate] = useGooglePlaces1();
    const [results3, setResults3] = useState(results2)
    //console.log(results)
    console.log('lengthofarray= '+ results.fillthisarray.length)
    let bestarray = [];
    

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
            setValue([...tasks][0].desc)
           /* if (needupdate === true) {
                setResults3(results2)
            }*/
            })
            


        return unsubscribe
    }, []);

    return (
        <View style = {{ flex: 1}}>
            <SearchBar 
                term={term} 
                onTermChange={setTerm}
                onTermSubmit={() => searchApi(term, true, value)}
                />
            {errorMessage? <Text>{errorMessage}LOADING</Text> : null}
                <ResultsList 
                    results={results3} 
                    title="All results" 
                />
        </View>
        
    );
};

const styles = StyleSheet.create({});

export default SearchScreen;