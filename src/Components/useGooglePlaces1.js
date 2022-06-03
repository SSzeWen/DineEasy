import {Google_apikey} from "@env"
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Currentlocation from "./Currentlocation";



//import SearchScreenGoogle from "../screens/SearchScreenGoogle";
//import GooglePlacesNextPage from "./GooglePlacesNextPage";

let fillthisarray = [];
let fillsecondarray = [];
let therealarray = [];

async function GooglePlacesNextPage2 (token) {
  const latitude = 1.4304; // you can update it with user's latitude & Longitude
    const longitude = 103.8354;
    //const [latitude, longitude] = Currentlocation();
    let radMetter = 1000; // Search withing 1 KM radius
    if (token === undefined) {
      return
    }
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude +'&radius=' + radMetter + '&type=restaurant&opennow=true' + '&key=' + Google_apikey + '&pagetoken=' + token
    //const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=' + token + '&key=' + Google_apikey
    console.log(url)

    await fetch(url)
      .then(res => {
        return res.json()
      })
      .then(res => {

      var places = [] // This Array WIll contain locations received from google
        for(let googlePlace of res.results) {
          var place = {}
          var lat = googlePlace.geometry.location.lat;
          var lng = googlePlace.geometry.location.lng;
          var coordinate = {
            latitude: lat,
            longitude: lng,
          }

          var gallery = []

          if (googlePlace.photos) {
           for(let photo of googlePlace.photos) {
             var photoUrl = photo.photo_reference;
             gallery.push(photoUrl);
          }
        }

          place['placeTypes'] = googlePlace.types
          place['coordinate'] = coordinate
          place['id'] = googlePlace.place_id
          place['placeName'] = googlePlace.name
          place['gallery'] = gallery
          place['rating'] = googlePlace.rating
          place['image_url'] = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + gallery[0] + '&key=' + Google_apikey
          place['review_count'] = googlePlace.user_ratings_total
          places.push(place);
          fillthisarray.push(place);
        }
        // Do your work here with places Array
        fillsecondarray.push(res.next_page_token);
        let digit = 0;
        for (let i = 0; i < places.length; i += 1) {
          let ratings = 0;
          console.log(places[i].placeName)
          if (ratings < places[i].rating) {
            ratings = places[i].rating;
            digit = i;
          }
        }
        console.log('Hello')    
      })
      .catch(error => {
        console.log(error);
      });
      console.log(fillsecondarray.length)
      return fillsecondarray[fillsecondarray.length - 1];
  }


function useGooglePlaces1() {

    //const latitude = 1.4304; // you can update it with user's latitude & Longitude
    //const longitude = 103.8354;
    const [latitude, longitude] = Currentlocation();
    let radMetter = 1000; // Search withing 1 KM radius
    
    //const [latitude, longitude] = Currentlocation();
    const [restaurantpic, setRestaurantpic] = useState('');
    const [token, setToken] = useState('');
    const [url1, setUrl1] = useState('')
    const [result, setResult] = useState()
    const [errorMessage, setErrorMessage] = useState('')
    console.log(latitude)
    console.log(longitude)
    const [numberoftimes, useNumberoftimes] = useState('false')
    
    const SearchApi = async(Searchterm, reset) => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&keyword=' + Searchterm +'&radius=' + radMetter + '&type=restaurant&opennow=true' + '&key=' + Google_apikey
    console.log(Searchterm);
    /*if (Searchterm !== '') {
      useNumberoftimes('false')
    }*/
    if (reset === true) {
      useNumberoftimes('false');
      /*useEffect(()=> {
        useNumberoftimes('false')
      },[])*/
    }/*
    if (fillthisarray.length >= 60) {
      for (var i = 0; i < 60; i += 1){
        fillthisarray.pop();
      }
    }*/
    if((numberoftimes === 'false' || reset === true) && latitude !== 1 && longitude !== 1) {
    console.log(url)
    await fetch(url)
      .then(res => {
        return res.json()
      })
      .then(res => {
      var places = [] // This Array WIll contain locations received from google
      for (var i = 0; i < 60; i += 1){
        fillthisarray.pop();
      }
      useNumberoftimes('true');
        for(let googlePlace of res.results) {
          var place = {}
          var lat = googlePlace.geometry.location.lat;
          var lng = googlePlace.geometry.location.lng;
          var coordinate = {
            latitude: lat,
            longitude: lng,
          }

          var gallery = []

          if (googlePlace.photos) {
           for(let photo of googlePlace.photos) {
             var photoUrl = photo.photo_reference;
             gallery.push(photoUrl);
          }
        }

          place['placeTypes'] = googlePlace.types
          place['coordinate'] = coordinate
          place['id'] = googlePlace.place_id
          place['placeName'] = googlePlace.name
          place['gallery'] = gallery
          place['rating'] = googlePlace.rating
          place['image_url'] = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + gallery[0] + '&key=' + Google_apikey
          place['review_count'] = googlePlace.user_ratings_total
          places.push(place);
          fillthisarray.push(place);
        }
        // Do your work here with places Array
        let digit = 0;
        for (let i = 0;i < places.length; i += 1) {
          let ratings = 0;
          console.log(places[i].placeName)
          if (ratings < places[i].rating) {
            ratings = places[i].rating;
            digit = i;
          }
        }
        fillsecondarray.push(res.next_page_token);
        setRestaurantpic(places[digit].gallery[0]);
        setToken(res.next_page_token);
        return res.next_page_token
               
      }).then(function(result){
        return new Promise(resolve => {
          setTimeout(()=>{
            resolve(GooglePlacesNextPage2(result));
          },2000)
        })
      }).then(function(result) {
         return new Promise(resolve => {
            setTimeout(()=>{
              resolve(GooglePlacesNextPage2(result));
            },2000)
          })
        }).then(function(result) {
          return
        })/*.then(function(result) {
            let counter = 0;
            let count = 0;
            console.log('fillthisarraylength = ' + fillthisarray.length)
            /*for (var i = 0; i < fillthisarray.length; i += 1) {
                if (i % 20 !== 0) {
                therealarray.push(fillthisarray[i]);
                }
                if (i % 20 === 0) {
                    if (fillthisarray[i] === therealarray[count]) {
                        i += 19;
                    }
                    else {
                        count = i;
                        therealarray.push(fillthisarray[i]);
                    }
                }
            }
            therealarray.push(fillthisarray[0])
            console.log('therealarray = ' + therealarray.length)
            console.log(therealarray.length);
            console.log(therealarray[therealarray.length - 1])
        })*/
      .catch(error => {
        setErrorMessage("Something went wrong")
        console.log(error);
      });
    }}
/*
    useEffect(()=> {
      SearchApi('')
    })
*/
      /*useEffect(()=> {
        const photoreference = restaurantpic;
        console.log('MeowMeow' + restaurantpic)
        console.log('fillthisarray = ' + fillthisarray.length)
        setUrl1('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + photoreference + '&key=' + Google_apikey)
      },[restaurantpic])*/

      return [SearchApi, {fillthisarray}, errorMessage]

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


  export default useGooglePlaces1