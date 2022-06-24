import {Google_apikey} from "@env"
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Currentlocation from "./Currentlocation";
import { auth,db } from '../firebase';
import { query, collection, onSnapshot, addDoc, setDoc, doc } from 'firebase/firestore';
import { Value } from "react-native-reanimated";



//import SearchScreenGoogle from "../screens/SearchScreenGoogle";
//import GooglePlacesNextPage from "./GooglePlacesNextPage";

let fillthisarray = [];
let fillsecondarray = [];
let therealarray = [];
let fillthirdarray = [];

async function GooglePlacesNextPage2 (token) {
  const latitude = 1.4304; // you can update it with user's latitude & Longitude
    const longitude = 103.8354;
    //const [latitude, longitude] = Currentlocation();
    let radMetter = 1000; // Search withing 1 KM radius
    if (token === undefined) {
      return
    }

    const Restauranturl = async(id) => {
      var resurl =  'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + id + '&fields=url&key=' + Google_apikey
        console.log(resurl)
        await fetch(resurl).then(res=> {
            return res.json()
        }).then(res=> {
          fillthirdarray.push(res.result.urls)
            return res.result.url
        }).then((res)=>{
          console.log("hello" + res)
          return fetch("https://jsonfile-27joodiwra-uc.a.run.app/predict", {
            method:'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body:JSON.stringify({'image':res})
          })
        }).then(res=> {
            return res.json()
          }).then((response)=> {
            console.log(response)
          })
        
        .catch(error => {
          setErrorMessage("Something went wrong")
          console.log(error);
        });
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
          Restauranturl(googlePlace.place_id);
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
    const [restaurantpic, setRestaurantpic] = useState('');
    const [token, setToken] = useState('');
    const [url1, setUrl1] = useState('')
    const [result, setResult] = useState()
    const [googleurl, setGoogleurl] = useState()
    const [errorMessage, setErrorMessage] = useState('')
    console.log(latitude)
    console.log(longitude)
    const [numberoftimes, useNumberoftimes] = useState('false')
    const [needupdate, setNeedupdate] = useState(false)

    const Restauranturl = async(id) => {
      var resurl =  'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + id + '&fields=url&key=' + Google_apikey
        console.log(resurl)
        await fetch(resurl).then(res=> {
            return res.json()
        }).then(res=> {
          fillthirdarray.push(res.result.url)
            return res.result.url
        }).then((res)=>{
          console.log("hello" + res)
          return fetch("https://jsonfile-27joodiwra-uc.a.run.app/predict", {
            method:'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body:JSON.stringify({'image':res})
          })
        }).then(res=> {
            return res.json()
          }).then((response)=> {
            console.log(response.prediction)
          })
        .catch(error => {
          setErrorMessage("Something went wrong")
          console.log(error);
        });
    }
    
    const SearchApi = async(Searchterm, reset, preference) => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&keyword=' + Searchterm +'&radius=' + radMetter + '&type=restaurant&opennow=true' + '&key=' + Google_apikey
    console.log(Searchterm);
    /*if (Searchterm !== '') {
      useNumberoftimes('false')
    }*/
    if (reset === true) {
      useNumberoftimes('false');
      setNeedupdate(false)
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
        fillthirdarray.pop();
        therealarray.pop();
      }
      useNumberoftimes('true');
        for(let googlePlace of res.results) {
          var count = 0;
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
          Restauranturl(googlePlace.place_id)
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
          setTimeout(()=>{
            for (var i = 0; i !== fillthisarray.length; i += 0) {
              let highest = fillthisarray[0].rating
              let count = 0;
              for (var j = 0; j < fillthisarray.length; j += 1) {
                if (highest < fillthisarray[j].rating) {
                  highest = fillthisarray[j].rating
                  count = j;
                }
              }
              therealarray.push(fillthisarray[count])
              fillthisarray.splice(count, 1)
            }
            const counter = therealarray.length
            for (var i = 0; i < counter - preference; i += 1) {
              therealarray.pop()
            }
            console.log(therealarray)
            setNeedupdate(true)
          },4000)
          return
        })
      .catch(error => {
        setErrorMessage("Something went wrong")
        console.log(error);
      });
    }}

      return [SearchApi, {fillthisarray}, fillthirdarray, {therealarray}, errorMessage, needupdate]

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