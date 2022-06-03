import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ResultsDetail from './ResultsDetail';
import * as RootNavigation from '../RootNavigation'

const ResultsList = ({ title, results, navigation }) => {
    //console.log('RESULTSLENGTH IS CALLED ONCE')
    //console.log(results)
    //console.log('resultslength is =' + results.length)
    if (!results.fillthisarray.length) {
        return null;
    }
    console.log('RESULTSLENGTH IS CALLED TWICE')
    useEffect(()=> {
        console.log('resultslength is muha=' + results.fillthisarray.length)
    },[])
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <FlatList 
                data={results.fillthisarray}
                keyExtractor={(result) => result.id}
                renderItem={({ item }) => {
                    return (
                    <TouchableOpacity onPress={() => RootNavigation.navigate("ResultsShow", { id: item.id })}>
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
        marginBottom: 10
        
    }
});

export default ResultsList;