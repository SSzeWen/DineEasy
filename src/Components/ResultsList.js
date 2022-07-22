import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ResultsDetail from './ResultsDetail';
import * as RootNavigation from '../RootNavigation'
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Dimensions , StatusBar } from 'react-native';




const ResultsList = ({ title, results, navigation }) => {
    //console.log('RESULTSLENGTH IS CALLED ONCE')
    //console.log(results)
    //console.log('resultslength is =' + results.length)


const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
    console.log(navbarHeight)
    if (!results.therealarray.length) {
        return null;
    }
    console.log('RESULTSLENGTH IS CALLED TWICE')
    useEffect(()=> {
        console.log('resultslength is muha=' + results.therealarray.length)
    },[])
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <FlatList 
                data={results.therealarray}
                keyExtractor={(result) => result.id}
                renderItem={({ item }) => {
                    return (
                    <TouchableOpacity onPress={() => RootNavigation.navigate("Overview", { id: item.id, rating:item.score, sentence:item.sentences, coordinate:item.coordinate, name:item.placeName })}>
                        <ResultsDetail result={item} />
                    </TouchableOpacity>
                    );
                }}
            />
            
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        marginBottom: 5
    },
    container : {
        marginBottom: ScreenHeight/4.9
        
    }
});

export default ResultsList;