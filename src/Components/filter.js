import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as RootNavigation from '../RootNavigation'

const Filter = ({undefined, distancefilter, pricefilter, sort}) => {
    console.log(undefined)
    return (
        <View style={{flex:1, justifyContent:'center', alignContent:'center',}}>
            {undefined?
            <TouchableOpacity onPress={()=> RootNavigation.navigate("Filter", {'distancefilter':6, 'pricefilter':[false,false,false,false], 'sort':true})}>
                <AntDesign name="filter" size={24} color="black" />
            </TouchableOpacity>:
            <TouchableOpacity onPress={()=> RootNavigation.navigate("Filter", {'distancefilter':distancefilter, 'pricefilter':pricefilter, 'sort':sort})}>
            <AntDesign name="filter" size={24} color="black" />
        </TouchableOpacity>}
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundStyle: {
        flex:9,
        marginTop: 10,
        backgroundColor: '#F0EEEE',
        height: 50,
        borderRadius: 5,
        marginHorizontal: 15,
        flexDirection: 'row',
        marginBottom: 10
    },
    inputStyles: {
        flex: 1,
        fontSize: 18
    },
    iconStyle: {
        fontSize: 35,
        alignSelf: 'center',
        marginHorizontal: 15
    }
});

export default Filter;