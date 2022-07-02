import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, FlatList } from 'react-native';

const ResultsDetail = ({ result }) => {
    //console.log('ihavereachedhere')
    return ( 
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: result.image_url }} />
            <Text style={styles.name}>{result.placeName}</Text>
            <Text>Rating: {Math.round(result.score)} , {result.review_count} Reviews, {result.distancetext} </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 15
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

export default ResultsDetail;