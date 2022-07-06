import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';

const SearchBar = ({ term, onTermChange, onTermSubmit, needupdate }) => {

    const [edit, setEdit] = useState(true)
    const  handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
        console.log(keyValue);
        if(keyValue === 'Enter')
        {
          console.log("enter");
        }
    };

    useEffect(()=> {
        if (needupdate == true) {
            setEdit(true)
        }
    },[needupdate])
    const onSubmit = () => {
        
        onTermSubmit()
        setEdit(false)
        /*setTimeout(()=> {
            setEdit(true)
        },4000)*/
    }
    return (

            <View style={styles.backgroundStyle}>
            <Feather name='search' style={styles.iconStyle}/>
            <TextInput 
                autoCapitalize='none'
                autoCorrect={false}
                style={styles.inputStyles}
                placeholder='search'
                value={term}
                onChangeText={onTermChange}
                onSubmitEditing={onSubmit}
                editable={edit}
            />
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

export default SearchBar;