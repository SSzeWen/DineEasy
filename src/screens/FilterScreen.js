import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db , auth} from '../firebase';
import {Google_apikey} from '@env'
import { hasServicesEnabledAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, withTheme } from 'react-native-elements';
import Spacer from '../Components/Spacer';
import * as RootNavigation from '../RootNavigation'
import {Slider} from '@miblanchard/react-native-slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';



const FilterScreen = ({route}) => {
console.log(route)
const [istapped, setIstapped] = useState(route.params.pricefilter[0])
const [istapped1, setIstapped1] = useState(route.params.pricefilter[1])
const [istapped2, setIstapped2] = useState(route.params.pricefilter[2])
const [istapped3, setIstapped3] = useState(route.params.pricefilter[3])
const [color, setColor] = useState(istapped==true? 'pink':'white')
const [color1, setColor1] = useState(istapped1==true?'pink':'white')
const [color2, setColor2] = useState(istapped2==true?'pink':'white')
const [color3, setColor3] = useState(istapped3==true?'pink':'white')
const [value, setValue] = useState(route.params.distancefilter)
const [selected, setSelected] = useState([])
const [istouched,setIstouched] = useState(route.params.sort)
const [istouched1,setIstouched1] = useState(route.params.distance)
const [istouched2, setIstouched2] = useState(route.params.recommend)

const Touched = () => {
    if (istouched) {
    }
    else {
        setIstouched(true)
        setIstouched1(false)
        setIstouched2(false)
    }
}

const Touched1 = ()=> {
    if (istouched1) {}
    else {
        setIstouched1(true)
        setIstouched(false)
        setIstouched2(false)
    }
}

const Touched2 = () => {
    if (istouched2) {}
    else {
        setIstouched1(false)
        setIstouched(false)
        setIstouched2(true)
    }
}

    
const Registered = () => {
    if (istapped) {
        setIstapped(false)
        setColor('white')
    }
    else {
        setIstapped(true)
        setColor('pink')

    }
}

const Registered1 = () => {
    if (istapped1) {
        setIstapped1(false)
        setColor1('white')
    }
    else {
        setIstapped1(true)
        setColor1('pink')

    }
}

const Registered2 = () => {
    if (istapped2) {
        setIstapped2(false)
        setColor2('white')
    }
    else {
        setIstapped2(true)
        setColor2('pink')

    }
}

const Registered3 = () => {
    if (istapped3) {
        setIstapped3(false)
        setColor3('white')
    }
    else {
        setIstapped3(true)
        setColor3('pink')

    }
}
    return (
        <View style={{flex:1}}>
            <View style={{flex:.2}}></View>
            <View style={{flex:.5, marginLeft:11}}>
                <Text style={{fontSize:18, fontWeight:'bold'}}>Sort</Text>
            </View>
            <View style={{flex:3}}>
                <View style={{flex:1, flexDirection:'row',  alignItems:'center', borderBottomWidth:0.2, marginHorizontal:10}}>
                    <Text style={{fontSize:17, alignItems:'flex-start'}}>
                        Top Rated (Default)
                    </Text>
                    <View style={{flex:1,flexDirection:'row', justifyContent:'flex-end'}}>
                {istouched?
            <TouchableOpacity onPress={()=> {Touched()}}>
            <MaterialCommunityIcons name="record-circle-outline" size={24} color="black" />
            </TouchableOpacity>:
            <TouchableOpacity onPress={()=> {Touched()}}>
            <MaterialCommunityIcons name="circle-outline" size={24} color="black" />
            </TouchableOpacity>
            }
            </View>
                </View>
                <View style={{flex:1, flexDirection:'row', alignItems:'center', borderBottomWidth:0.2, marginHorizontal:10}}>
                    <Text style={{fontSize:17}}>
                        Distance
                    </Text>
                    <View style={{flex:1,flexDirection:'row', justifyContent:'flex-end'}}>
                {istouched1?
            <TouchableOpacity onPress={()=> {Touched1()}}>
            <MaterialCommunityIcons name="record-circle-outline" size={24} color="black" />
            </TouchableOpacity>:
            <TouchableOpacity onPress={()=> {Touched1()}}>
            <MaterialCommunityIcons name="circle-outline" size={24} color="black" />
            </TouchableOpacity>
            }
            </View>
                </View>
                <View style={{flex:1, flexDirection:'row', alignItems:'center', borderBottomWidth:0.2, marginHorizontal:10}}>
                    <Text style={{fontSize:17}}>
                        Recommended Only
                    </Text>
                    <View style={{flex:1,flexDirection:'row', justifyContent:'flex-end'}}>
                {istouched2?
            <TouchableOpacity onPress={()=> {Touched2()}}>
            <MaterialCommunityIcons name="record-circle-outline" size={24} color="black" />
            </TouchableOpacity>:
            <TouchableOpacity onPress={()=> {Touched2()}}>
            <MaterialCommunityIcons name="circle-outline" size={24} color="black" />
            </TouchableOpacity>
            }
            </View>
                </View>
                
            
            </View>
            
            <View style={{flex:.5, marginLeft:11}}></View>
            <View style={{flex:1 , marginLeft:11}}>
                <Text style={{fontSize:18, fontWeight:'bold'}}>Filters</Text>
            </View>
            <View style={{flex:.5, marginLeft:11}}>
                <Text style={{fontSize:18,}}>Distance</Text>
            </View>
            <View style={{flex:2, justifyContent:'center', alignItems:'center', marginHorizontal:15 ,borderBottomWidth:.2}}>
            <Slider
                    value={value}
                    onValueChange={value => setValue(value)}
                    minimumValue={.5}
                    maximumValue={6}
                    step={.5}
                    trackClickable={true}
                    onSlidingComplete={(newvalue)=> {setValue(newvalue[0])}}
                    containerStyle={{width:'90%', justifyContent:'center'}}
                    
            />
            <Text style={{justifyContent:'center', alignItems:'center'}}> Distance in km: {value}</Text>
            </View>
            <View style={{flex:.5, marginLeft:11, marginTop:20}}>
                <Text style={{fontSize:18 }}>Price</Text>
            </View>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                
                
                <TouchableOpacity style={[styles.container, {backgroundColor:color}]} onPress={()=> Registered()}>
                    <Text>$</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.container, {backgroundColor:color1}]} onPress={()=> Registered1()}>
                    <Text>$$</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.container, {backgroundColor:color2}]} onPress={()=> Registered2()}>
                    <Text>$$$</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.container, {backgroundColor:color3}]} onPress={()=> Registered3()}>
                    <Text>$$$$</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex:.3, borderBottomWidth:.2, marginHorizontal:15}}/>
            
            
            <View style={{flex:1}}>
                <TouchableOpacity style={[styles.container, {backgroundColor:'pink'}]} onPress={()=> RootNavigation.navigate("Search", {distancefilter:value, pricefilter:[istapped,istapped1,istapped2,istapped3], sort:istouched, distance:istouched1,recommend:istouched2})}>
                    <Text style={{fontWeight: 'bold'}}>
                        Apply Changes
                    </Text>
                </TouchableOpacity>
            </View>
            
        </View>
        
    )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        marginHorizontal:8,
        marginVertical:5
        
    },
  });

export default FilterScreen;