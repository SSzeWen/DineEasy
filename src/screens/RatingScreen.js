import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable, SafeAreaView,
    Image, ToastAndroid} from 'react-native';
import { query, collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db , auth} from '../firebase';
import * as RootNavigation from '../RootNavigation'


const RatingScreen = ({route}) => {
  console.log(route)
    const restaurantname = route.params.restaurant_id
    const photo_reference = route.params.photo_reference
    const score = route.params.score
    const sentence = route.params.sentence
    // To set the default Star Selected
    const [defaultRating, setDefaultRating] = useState(2);
    const [task, setTask] = useState('');
    // To set the max number of Stars
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  
    // Filled Star. You can also give the path from local
    const starImageFilled =
      'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
    // Empty Star. You can also give the path from local
    const starImageCorner =
      'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';
  
    const CustomRatingBar = () => {
      return (
        <View style={styles.customRatingBarStyle}>
          {maxRating.map((item, key) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={() => setDefaultRating(item)}>
                <Image
                  style={styles.starImageStyle}
                  source={
                    item <= defaultRating
                      ? { uri: starImageFilled }
                      : { uri: starImageCorner }
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
      );
    };

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    const onSubmitHandler = async (instruction, rating, photo_reference) => {
        /*console.log(restaurantname)
        setTask(restaurantname)
        if (task.length === 0) {
            showRes('Task description cannot be empty!');
            return;
        }*/

        try {
            const taskRef = await addDoc(collection(db, "User", auth.currentUser.uid, instruction), {
                desc: restaurantname,
                completed: false,
                rating: rating,
                photo_reference: photo_reference,
                score: score,
                sentence: sentence
            });

            console.log('onSubmitHandler success', taskRef.id);
            showRes('Successfully added task!');
        } catch (err) {
            console.log('onSubmitHandler failure', err);
            showRes('Failed to add task!');
        }
        return RootNavigation.navigate("Main", {screen: "Rated Restaurants"})
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.textStyle}>What do you think of the food from {restaurantname}</Text>
          {/*View to hold our Stars*/}
          <CustomRatingBar />
          <Text style={styles.textStyle}>
            {/*To show the rating selected*/}
            {defaultRating} / {Math.max.apply(null, maxRating)}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonStyle}
            onPress={() => onSubmitHandler('Rated Restaurants', defaultRating, photo_reference)}>
            {/*Clicking on button will show the rating as an alert*/}
            <Text style={styles.buttonTextStyle}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };
  /*
<Pressable style={styles.Ratebutton}
                onPress={()=> {
                    console.log()
                }}
                android_ripple={{ color: '#FFF' }}>
                    <Text>Submit</Text>
                </Pressable>

        </View>
    );
};*/
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    Ratebutton: {
        backgroundColor: '#f54275',
        marginVertical: 10,
        paddingVertical: 10,
        width: '35%',
        height: '6%',
        alignItems: 'center',
        borderRadius: 10
    },

    titleText: {
      padding: 8,
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    textStyle: {
      textAlign: 'center',
      fontSize: 23,
      color: '#000',
      marginTop: 15,
    },
    textStyleSmall: {
      textAlign: 'center',
      fontSize: 16,
      color: '#000',
      marginTop: 15,
    },
    buttonStyle: {
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 30,
      padding: 15,
      backgroundColor: '#8ad24e',
    },
    buttonTextStyle: {
      color: '#fff',
      textAlign: 'center',
    },
    customRatingBarStyle: {
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 30,
    },
    starImageStyle: {
      width: 40,
      height: 40,
      resizeMode: 'cover',
    },
  });
export default RatingScreen;