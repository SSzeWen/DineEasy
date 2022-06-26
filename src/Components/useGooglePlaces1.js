import {Google_apikey} from "@env"
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Currentlocation from "./Currentlocation";
import { auth,db } from '../firebase';
import { query, collection, onSnapshot, addDoc, setDoc, doc, connectFirestoreEmulator } from 'firebase/firestore';
import { Value } from "react-native-reanimated";



//import SearchScreenGoogle from "../screens/SearchScreenGoogle";
//import GooglePlacesNextPage from "./GooglePlacesNextPage";

let fillthisarray = [];
let fillsecondarray = [];
let therealarray = [];
let fillthirdarray = [];
let fillpreferarray = [];
let instancecounter = 0;

async function GooglePlacesNextPage2 (token) {
  const latitude = 1.4304; // you can update it with user's latitude & Longitude
    const longitude = 103.8354;
    //const [latitude, longitude] = Currentlocation();
    let radMetter = 1000; // Search withing 1 KM radius
    if (token === undefined) {
      return
    }

    const Restauranturl = async(id) => {
      var resurl =  'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + id + '&fields=url%2Creview&key=' + Google_apikey
        //console.log(resurl)
        await fetch(resurl).then(res=> {
            return res.json()
        }).then(res=> {
          var array = []
          //console.log(res)
          for (var i = 0; i < res.result.reviews.length; i += 1) {
            //console.log(res.result.reviews[i].text)
            array.push(res.result.reviews[i].text)
          }
          fillthirdarray.push(res.result.url)
            return array
        })/*.then((res)=>{
          console.log("hello" + res)
          return fetch("https://dineeasy.herokuapp.com/predict", {
            method:'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body:JSON.stringify({'url':res})
          })
        }).then(res=> {
            return res.json()
          }).then((response)=> {
            return response.Reviews
          })*/.then(res=> {
            //console.log(res)
            return fetch("https://jsonfile-27joodiwra-uc.a.run.app/predict", {
                method:'POST',
                headers: {
                  'Content-Type':'application/json'
                },
                body:JSON.stringify({'image':res})
              })
            }).then(response=> {
                return response.json()
              }).then(result=> {
                console.log(result)
              }).catch(error => {
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
          //Restauranturl(googlePlace.place_id);
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


    const Restauranturl = async(id, count, preference) => {
      var resurl =  'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + id + '&fields=url%2Creview&key=' + Google_apikey
        console.log(resurl)
        const heroku = ["https://dineeasy.herokuapp.com/predict", "https://dineeasy-orbital.herokuapp.com/predict", "https://seltest908.herokuapp.com/predict", "https://dineeasy-2.herokuapp.com/predict", "https://dineeasy-3.herokuapp.com/predict"]
        const cloud = ["https://jsonfile-27joodiwra-uc.a.run.app/predict", "https://jsonfile1-27joodiwra-uc.a.run.app/predict"]
        await fetch(resurl).then(res=> {
            return res.json()
        }).then(res=> {
          var array = []
          //console.log(res)
          for (var i = 0; i < res.result.reviews.length; i += 1) {
            //console.log(res.result.reviews[i].text)
            array.push(res.result.reviews[i].text)
          }
          fillthirdarray.push(res.result.url)
            return res.result.url
        }).then((res)=>{
          console.log("hello" + res)
          let counter = count%5
          return fetch(heroku[counter], {
            method:'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body:JSON.stringify({'url':res})
          })
        }).then(res=> {
            return res.json()
          }).then((response)=> {
            return response.Reviews
          }).then(res=> {
            console.log(res)
            let counter1 = count%2
            return fetch(cloud[0], {
                method:'POST',
                headers: {
                  'Content-Type':'application/json'
                },
                body:JSON.stringify({'image':res})
              })
            }).then(response=> {
                return response.json()
              }).then(result=> {
                fillpreferarray.push({"id":id, "review":result.prediction})
                console.log({"id":id, "review":result.prediction})
                instancecounter += 1;
                return instancecounter
              }).then(counter=> {
                if (counter == preference) {
                  console.log(fillpreferarray)
              for (var i = 0; i < preference; i += 1) {
                let highest = 0
                let count = 0
                for (var j = i; j < preference; j += 1){
                  if (highest < fillpreferarray[j].review) {
                    highest = fillpreferarray[j].review
                    count = j
                  }
                }
                for (var j = 0; j < preference; j += 1) {
                  if (therealarray[j].id == fillpreferarray[count].id) {
                    const temp = therealarray[i]
                    const temp1 = fillpreferarray[i]
                    therealarray[i] = therealarray[j]
                    fillpreferarray[i] = fillpreferarray[count]
                    therealarray[j] = temp
                    fillpreferarray[count] = temp1
                    therealarray[i]['score'] = fillpreferarray[i].review
                    j = preference
                    //console.log(therealarray)
                  }
                }
              }
              setTimeout(()=> {
                setNeedupdate(true)
              },1000)                  
                }
              }).catch(error => {
          setErrorMessage("Something went wrong")
          console.log(error);
        });
    }

   /* const Restauranturl = async(id) => {
      var resurl =  'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + id + '&fields=url%2Creview&key=' + Google_apikey
        console.log(resurl)
        await fetch(resurl).then(res=> {
            return res.json()
        }).then(res=> {
          var array = []
          //console.log(res)
          for (var i = 0; i < res.result.reviews.length; i += 1) {
            //console.log(res.result.reviews[i].text)
            array.push(res.result.reviews[i].text)
          }
          fillthirdarray.push(res.result.url)
            return array
        }).then(res=> {
            return fetch("https://jsonfile-27joodiwra-uc.a.run.app/predict", {
                method:'POST',
                headers: {
                  'Content-Type':'application/json'
                },
                body:JSON.stringify({'image':res})
              })
            }).then(response=> {
                return response.json()
              }).then(result=> {
                fillpreferarray.push({"id":id, "review":result.prediction})
                console.log({"id":id, "review":result.prediction})
              }).catch(error => {
          setErrorMessage("Something went wrong")
          console.log(error);
        });
    }*/
    

    const SearchApi = async(Searchterm, reset, preference) => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&keyword=' + Searchterm +'&radius=' + radMetter + '&type=restaurant&opennow=true' + '&key=' + Google_apikey
    console.log(Searchterm);
    if (reset === true) {
      useNumberoftimes('false');
      setNeedupdate(false)
    }
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
        fillpreferarray.pop();
        instancecounter = 0;
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
          //Restauranturl(googlePlace.place_id)
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
            let counts = 0;
            for (var i = 0; i < fillthisarray.length; i += 1) {
              if (fillthisarray[i].review_count < 10){
                fillthisarray[i].rating = 0;
              }
            }
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
            if (counter < preference) {
              preference = counter
            }          
            
            for (var i = 0; i < counter - preference; i += 1) {
              therealarray.pop()
            }         

            for (var i = 0; i < preference; i += 1) {
              Restauranturl(therealarray[i].id, i, preference)
            }
          },2000)
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