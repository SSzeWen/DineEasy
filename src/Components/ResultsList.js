import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ResultsDetail from './ResultsDetail';
import * as RootNavigation from '../RootNavigation'
import Spacer from './Spacer';

const ResultsList = ({ title, results, navigation }) => {
    //console.log('RESULTSLENGTH IS CALLED ONCE')
    //console.log(results)
    //console.log('resultslength is =' + results.length)
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
                    <TouchableOpacity onPress={() => RootNavigation.navigate("ResultsShow", { id: item.id, rating:item.score, sentence:item.sentences })}>
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
        marginBottom: '32%'
        
    }
});

export default ResultsList;