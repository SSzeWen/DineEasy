import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const Recommendstar = ({result}) => {
    if (result.recommendstar < 4.5) {
    return <MaterialIcons style={{justifyContent:'flex-end'}}name="recommend" size={20} color="orange" />
    }
    else {
        return <MaterialIcons style={{justifyContent:'flex-end'}}name="recommend" size={20} color="green" />
    }
}

const Dollarsign = ({result}) => {
    if (result == 1) {
        return (<FontAwesome name="dollar" size={15} color="black" />)
    }
    else if (result == 2) {
        return (
        <View style={{flex:1, flexDirection:'row'}}>
            <FontAwesome name="dollar" size={15} color="black" />
            <FontAwesome name="dollar" size={15} color="black" />
        </View>)
    }
    else if (result == 3) {
        return (
    <View style={{flex:1, flexDirection:'row'}}>
        <FontAwesome name="dollar" size={15} color="black" />
        <FontAwesome name="dollar" size={15} color="black" />
        <FontAwesome name="dollar" size={15} color="black" />
    </View>
        )
    }
    else if (result == 4) {
        return (
        <View style={{flex:1, flexDirection:'row'}}>
            <FontAwesome name="dollar" size={15} color="black" />
            <FontAwesome name="dollar" size={15} color="black" />
            <FontAwesome name="dollar" size={15} color="black" />
            <FontAwesome name="dollar" size={15} color="black" />
        </View>
        )
    }

}


const ResultsDetail = ({ result }) => {
    //console.log('ihavereachedhere')
    console.log(result.gallery)
    return ( 
        <View style={styles.container}>
            <View style={{flex:10}}>
            {result.gallery.length!=0?
            <Image style={styles.image} source={{ uri: result.image_url }} />:
            <Image style={styles.image} source={require('./Blank.jpeg')} />}
            <Text style={styles.name}>{result.placeName}</Text>
            </View>
            <View>
                {result.price_level? <Dollarsign result={result.price_level}/> : null}
            </View>
            <View style={{flex:1,
        flexDirection: 'row',}}>
            <View style={{flex:1, justifyContent:'flex-start'}}> 
                <Text style={styles.name}>{result.distancetext}</Text>
            </View>
            <View style={styles.bundle}>
            <AntDesign name="star" size={17} color="#F637EC" />
            {result.score==-1?
            <Text style={styles.name}> No Rating
            </Text>:<Text style={styles.name}> {Math.round(result.score)}
            </Text>}
            <Text> ({result.review_count} Reviews) </Text>
            {result.recommend? <Recommendstar result={result}/> : null}
            <Text> </Text>
            </View> 
            </View>
            <View style={{margin:7}}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginLeft: 15,
        marginRight: 15
    },
    image: {
        flex:9,
        width: '100%',
        height: 220,
        borderRadius: 15,
        marginBottom: 5
    },
    name: {
        fontWeight: 'bold',
    },
    bundle: {
        flex:1,
        flexDirection: 'row',
        justifyContent:'flex-end',
        alignContent:'center',
        alignItems:'center'

    }

});

export default ResultsDetail;