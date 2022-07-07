import {Google_apikey} from "@env"
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Currentlocation from "./Currentlocation";
import { auth,db } from '../firebase';
import { query, collection, onSnapshot, addDoc, setDoc, doc, connectFirestoreEmulator } from 'firebase/firestore';
import { Value } from "react-native-reanimated";
import { HeaderStyleInterpolators } from "react-navigation-stack";
import { async } from "@firebase/util";



//import SearchScreenGoogle from "../screens/SearchScreenGoogle";
//import GooglePlacesNextPage from "./GooglePlacesNextPage";
let meowmeow = 0;
let fillthisarray = [];
let fillsecondarray = [];
let therealarray = [];
let fillthirdarray = [];
let fillpreferarray = [];
let fillreviewarray = [];
let instancecounter = 0;
let filldistancecounter = [];
let fillfilterarray = [];


const recommender = async(ratedsentence, sentences, needupdate) => {
  console.log("I AM CALLED")
  const url = "https://sentences-27joodiwra-uc.a.run.app/predict"
  console.log("start")
  console.log(ratedsentence)
  console.log("hello")
  console.log(sentences)
  for (var i = 0; i < ratedsentence.sentence.length; i += 1) {
    const newarray = [ratedsentence.sentence[i][0]]
    for (var j = 0; j < sentences.length; j += 1) {
      newarray.push(sentences[j])
    }
    console.log(newarray)
    await fetch(url, {
      method:'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({'sentence':newarray})
    }).then(res => res.json())
    .then(result => {
      console.log(result)
      fillfilterarray.push(result)
      return result.index
    }).then(res => {
      for (var h = 1; h < res.length; h += 1) {
        therealarray[res[h]-1]['recommend'] = true
        therealarray[res[h]-1]['recommendstar'] = ratedsentence.sentence[i][1]
      }
      if (i == ratedsentence.sentence.length -1) {
        setTimeout(()=> {
          needupdate(1)
        },200)
      }
    }
    ).catch(error=> {
      console.log(error)
    })
  }
    setTimeout(()=> {
      needupdate()
    },1000)
  
}


function distancecalculator(destination, longitude, latitude) {
  const distanceurl = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + latitude + "%2C" + longitude + '&destinations=place_id:' + destination + '&key=' + Google_apikey
  fetch(distanceurl).then(res => res.json())
  .then(response=>{
    response.rows[0].elements[0].distance['id'] = destination
    console.log(response.rows[0].elements[0].distance)
    filldistancecounter.push(response.rows[0].elements[0].distance)
  }).catch(error=> {
    console.log(error)
  })

}
function restauranturl1(id,count, preference, needupdate, resurl, ratedsentence) {
  const heroku = ["https://dineeasy.herokuapp.com/predict", "https://dineeasy-orbital.herokuapp.com/predict", "https://seltest908.herokuapp.com/predict", "https://dineeasy-2.herokuapp.com/predict", "https://dineeasy-3.herokuapp.com/predict",
        "https://dineeasy-4.herokuapp.com/predict","https://dineeasy-5.herokuapp.com/predict","https://dineeasy-6.herokuapp.com/predict","https://dineeasy-7.herokuapp.com/predict","https://dineeasy-8.herokuapp.com/predict",
        "https://dineeasy-9.herokuapp.com/predict","https://dineeasy-10.herokuapp.com/predict","https://dineeasy-11.herokuapp.com/predict","https://dineeasy-12.herokuapp.com/predict","https://dineeasy-13.herokuapp.com/predict"]
        const cloud = ["https://jsonfile-27joodiwra-uc.a.run.app/predict", "https://jsonfile1-27joodiwra-uc.a.run.app/predict"]

        fetch(resurl).then(res=> {
          return res.json()
      }).then(res=> {
        /*var array = []
        for (var i = 0; i < res.result.reviews.length; i += 1) {
          array.push(res.result.reviews[i].text)
        }*/
        fillthirdarray.push(res.result.url)
          return res.result.url
      }).then((res)=>{
        console.log("hello" + res)
        let counter = count%15
        return fetch(heroku[counter], {
          method:'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body:JSON.stringify({'url':res})
        })
      }).then(res=> {
          meowmeow += 1;
          console.log(meowmeow)
          return res.json()
        }).then((response)=> {
          //console.log(response)
          console.log(response.Sentence)
          fillreviewarray.push({sentence: response.Sentence, id: id})
          return response.Reviews
        }).then(res=> {
          //console.log(res)
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
              if (counter == fillthisarray.length) {
                console.log(fillpreferarray)
                console.log("fillpreferarray lenght is =" + fillpreferarray.length)
                console.log("fillthisarray length is = " + fillthisarray.length)
                console.log("REACHED FKER")
            for (var i = 0; i < fillthisarray.length; i += 1) {
              let highest = -5
              let count = 0
              for (var j = i; j < fillthisarray.length; j += 1){
                if (highest < fillpreferarray[j].review) {
                  highest = fillpreferarray[j].review
                  count = j
                  console.log(fillpreferarray)
                }
              }
              for (var j = 0; j < fillthisarray.length; j += 1) {
                if (therealarray[j].id == fillpreferarray[count].id) {
                  const temp = therealarray[i]
                  const temp1 = fillpreferarray[i]
                  therealarray[i] = therealarray[j]
                  fillpreferarray[i] = fillpreferarray[count]
                  therealarray[j] = temp
                  fillpreferarray[count] = temp1
                  therealarray[i]['score'] = fillpreferarray[i].review
                  console.log(fillpreferarray)
                  j = 60
                  //console.log(therealarray)
                }
              }
            }
            for (var i = 0; i < therealarray.length; i += 1) {
              for (var j = 0; j < therealarray.length;j += 1) {
                if (fillreviewarray[j].id == therealarray[i].id) {
                  therealarray[i]['sentences'] = fillreviewarray[j].sentence
                  var temp = fillreviewarray[i]
                  fillreviewarray[i] = fillreviewarray[j]
                  fillreviewarray[j] = temp
                  j = 60
                }
              }
            }
            for (var i = 0; i < therealarray.length; i += 1) {
              for (var j = 0; j < therealarray.length;j += 1) {
                if (filldistancecounter[j].id == therealarray[i].id) {
                  therealarray[i]['distancetext'] = filldistancecounter[j].text
                  therealarray[i]['distance'] = filldistancecounter[j].value/1000
                  j = 60
                }
              }
            }
            /*
            for (var i = 0; i < fillpreferarray.length-preference; i += 1) {
              therealarray.pop();
            }*/
            const reviewarray = []
              for (var i = 0; i < therealarray.length; i += 1) {
                reviewarray.push(fillreviewarray[i].sentence)
              }
              recommender(ratedsentence, reviewarray, needupdate)           
              }
            }).catch(error => {
        console.log(error)
        fillpreferarray.push({"id":id, "review":-1})
        instancecounter += 1;
        console.log("server is down: " + count)
      })
}


async function GooglePlacesNextPage2 (token, preference, needupdate, ratedsentence) {
  const latitude = 1.4304; // you can update it with user's latitude & Longitude
    const longitude = 103.8354;
    //const [latitude, longitude] = Currentlocation();
    let radMetter = 2000; // Search withing 1 KM radius
    if (token === undefined) {
      return
    }

    const Restauranturl = async(id, count, preference, ratedsentence) => {
      var resurl =  'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + id + '&fields=url&key=' + Google_apikey
        console.log(resurl)
        const heroku = ["https://dineeasy.herokuapp.com/predict", "https://dineeasy-orbital.herokuapp.com/predict", "https://seltest908.herokuapp.com/predict", "https://dineeasy-2.herokuapp.com/predict", "https://dineeasy-3.herokuapp.com/predict",
        "https://dineeasy-4.herokuapp.com/predict","https://dineeasy-5.herokuapp.com/predict","https://dineeasy-6.herokuapp.com/predict","https://dineeasy-7.herokuapp.com/predict","https://dineeasy-8.herokuapp.com/predict",
        "https://dineeasy-9.herokuapp.com/predict","https://dineeasy-10.herokuapp.com/predict","https://dineeasy-11.herokuapp.com/predict","https://dineeasy-12.herokuapp.com/predict","https://dineeasy-13.herokuapp.com/predict"]
        const cloud = ["https://jsonfile-27joodiwra-uc.a.run.app/predict", "https://jsonfile1-27joodiwra-uc.a.run.app/predict"]
        await fetch(resurl).then(res=> {
            return res.json()
        }).then(res=> {
          /*var array = []
          for (var i = 0; i < res.result.reviews.length; i += 1) {
            array.push(res.result.reviews[i].text)
          }*/
          fillthirdarray.push(res.result.url)
            return res.result.url
        }).then((res)=>{
          console.log("hello" + res)
          let counter = count%15
          return fetch(heroku[counter], {
            method:'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body:JSON.stringify({'url':res})
          })
        }).then(res=> {
            meowmeow += 1;
            console.log(meowmeow)
            return res.json()
          }).then((response)=> {
            //console.log(response)
            console.log(response.Sentence)
            fillreviewarray.push({sentence: response.Sentence, id: id})
            return response.Reviews
          }).then(res=> {
            //console.log(res)
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
                if ((counter == fillthisarray.length)) {
                  console.log(fillpreferarray)
                  console.log("fillpreferarray lenght is =" + fillpreferarray.length)
                  console.log("fillthisarray length is = " + fillthisarray.length)
                  console.log("REACHED FKER")
              for (var i = 0; i < fillthisarray.length; i += 1) {
                let highest = -5
                let count = 0
                for (var j = i; j < fillthisarray.length; j += 1){
                  if (highest < fillpreferarray[j].review) {
                    highest = fillpreferarray[j].review
                    count = j
                    console.log(fillpreferarray)
                  }
                }
                for (var j = 0; j < fillthisarray.length; j += 1) {
                  if (therealarray[j].id == fillpreferarray[count].id) {
                    const temp = therealarray[i]
                    const temp1 = fillpreferarray[i]
                    therealarray[i] = therealarray[j]
                    fillpreferarray[i] = fillpreferarray[count]
                    therealarray[j] = temp
                    fillpreferarray[count] = temp1
                    therealarray[i]['score'] = fillpreferarray[i].review
                    console.log(fillpreferarray)
                    j = 60
                    //console.log(therealarray)
                  }
                }
              }
              for (var i = 0; i < therealarray.length; i += 1) {
                for (var j = 0; j < therealarray.length;j += 1) {
                  if (fillreviewarray[j].id == therealarray[i].id) {
                    therealarray[i]['sentences'] = fillreviewarray[j].sentence
                    var temp = fillreviewarray[i]
                    fillreviewarray[i] = fillreviewarray[j]
                    fillreviewarray[j] = temp
                    j = 60
                  }
                }
              }
              for (var i = 0; i < therealarray.length; i += 1) {
                for (var j = 0; j < therealarray.length;j += 1) {
                  if (filldistancecounter[j].id == therealarray[i].id) {
                    therealarray[i]['distancetext'] = filldistancecounter[j].text
                    therealarray[i]['distance'] = filldistancecounter[j].value/1000
                    j = 60
                  }
                }
              }/*
              for (var i = 0; i < fillpreferarray.length-preference; i += 1) {
                therealarray.pop();
              }*/
              const reviewarray = []
              for (var i = 0; i < therealarray.length; i += 1) {
                reviewarray.push(fillreviewarray[i].sentence)
              }
              recommender(ratedsentence, reviewarray, needupdate)
         
                }
              }).catch(error => {
                restauranturl1(id, count + 1,preference, needupdate, resurl, ratedsentence)
                //fillpreferarray.push({"id":id, "review":-1})
                //instancecounter += 1;
                console.log("server is down: " + count)
          //setErrorMessage("Something went wrong")

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

      var count = 0;
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
          place['price_level'] = googlePlace.price_level
          if (googlePlace.user_ratings_total > 5){
          places.push(place);
          fillthisarray.push(place);
          therealarray.push(place)
          Restauranturl(googlePlace.place_id, count, preference, ratedsentence);
          distancecalculator(googlePlace.place_id, longitude, latitude)
          count += 1
          }
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
    const [latitude, longitude, address] = Currentlocation();
    let radMetter = 2000; // Search withing 1 KM radius
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
    
    


    const updater = (hello) => {
      if (hello == 1) {
        setNeedupdate('haha')
      }
      setNeedupdate(true)
    }




    const Restauranturl = async(id, count, preference, ratedsentence) => {
      var resurl =  'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + id + '&fields=url&key=' + Google_apikey
        console.log(resurl)
        const heroku = ["https://dineeasy.herokuapp.com/predict", "https://dineeasy-orbital.herokuapp.com/predict", "https://seltest908.herokuapp.com/predict", "https://dineeasy-2.herokuapp.com/predict", "https://dineeasy-3.herokuapp.com/predict",
        "https://dineeasy-4.herokuapp.com/predict","https://dineeasy-5.herokuapp.com/predict","https://dineeasy-6.herokuapp.com/predict","https://dineeasy-7.herokuapp.com/predict","https://dineeasy-8.herokuapp.com/predict",
        "https://dineeasy-9.herokuapp.com/predict","https://dineeasy-10.herokuapp.com/predict","https://dineeasy-11.herokuapp.com/predict","https://dineeasy-12.herokuapp.com/predict","https://dineeasy-13.herokuapp.com/predict"]
        const cloud = ["https://jsonfile-27joodiwra-uc.a.run.app/predict", "https://jsonfile1-27joodiwra-uc.a.run.app/predict"]
        await fetch(resurl).then(res=> {
            return res.json()
        }).then(res=> {
          /*var array = []
          for (var i = 0; i < res.result.reviews.length; i += 1) {
            array.push(res.result.reviews[i].text)
          }*/
          fillthirdarray.push(res.result.url)
            return res.result.url
        }).then((res)=>{
          console.log("hello" + res)
          let counter = count%15
          return fetch(heroku[counter], {
            method:'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body:JSON.stringify({'url':res})
          })
        }).then(res=> {
            meowmeow += 1;
            console.log(meowmeow)
            return res.json()
          }).then((response)=> {
            //console.log(response)
            console.log(response.Sentence)
            fillreviewarray.push({sentence: response.Sentence, id: id})
            return response.Reviews
          }).then(res=> {
            //console.log(res)
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
        
                if (counter == fillthisarray.length) {
                  console.log(fillpreferarray)
                  console.log("fillpreferarray lenght is =" + fillpreferarray.length)
                  console.log("fillthisarray length is = " + fillthisarray.length)
                  console.log("REACHED FKER")
              for (var i = 0; i < fillthisarray.length; i += 1) {
                let highest = -5
                let count = 0
                for (var j = i; j < fillthisarray.length; j += 1){
                  if (highest < fillpreferarray[j].review) {
                    highest = fillpreferarray[j].review
                    count = j
                    console.log(fillpreferarray)
                  }
                }
                for (var j = 0; j < fillthisarray.length; j += 1) {
                  if (therealarray[j].id == fillpreferarray[count].id) {
                    const temp = therealarray[i]
                    const temp1 = fillpreferarray[i]
                    therealarray[i] = therealarray[j]
                    fillpreferarray[i] = fillpreferarray[count]
                    therealarray[j] = temp
                    fillpreferarray[count] = temp1
                    therealarray[i]['score'] = fillpreferarray[i].review
                    console.log(fillpreferarray)
                    j = 60
                    //console.log(therealarray)
                  }
                }
              }
              for (var i = 0; i < therealarray.length; i += 1) {
                for (var j = 0; j < therealarray.length;j += 1) {
                  if (fillreviewarray[j].id == therealarray[i].id) {
                    therealarray[i]['sentences'] = fillreviewarray[j].sentence
                    var temp = fillreviewarray[i]
                    fillreviewarray[i] = fillreviewarray[j]
                    fillreviewarray[j] = temp
                    j = 60
                  }
                }
              }
              for (var i = 0; i < therealarray.length; i += 1) {
                for (var j = 0; j < therealarray.length;j += 1) {
                  if (filldistancecounter[j].id == therealarray[i].id) {
                    therealarray[i]['distancetext'] = filldistancecounter[j].text
                    therealarray[i]['distance'] = filldistancecounter[j].value/1000
                    j = 60
                  }
                }
              }/*
              for (var i = 0; i < fillpreferarray.length-preference; i += 1) {
                therealarray.pop();
              }*/
              const reviewarray = []
              for (var i = 0; i < therealarray.length; i += 1) {
                reviewarray.push(fillreviewarray[i].sentence)
              }
              recommender(ratedsentence, reviewarray, updater)         
                }
              }).catch(error => {
                restauranturl1(id, count + 1, preference, updater, resurl, ratedsentence)
                //fillpreferarray.push({"id":id, "review":-1})
                //instancecounter += 1;
                console.log("server is down: " + count)
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
    

    const SearchApi = async(Searchterm, reset, preference, ratedsentence) => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&keyword=' + Searchterm +'&radius=' + radMetter + '&type=restaurant&opennow=true' + '&key=' + Google_apikey
    console.log(Searchterm);
    console.log(url)
    console.log(ratedsentence)
    
    //ratedsentencefilter(ratedsentence)
    
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
        filldistancecounter.pop();
        fillfilterarray.pop();
      }
      useNumberoftimes('true');
      var count = 0;
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
          place['price_level'] = googlePlace.price_level
          if (googlePlace.user_ratings_total > 5) {
          places.push(place);
          fillthisarray.push(place);
          therealarray.push(place)
          Restauranturl(googlePlace.place_id, count, preference, ratedsentence)
          distancecalculator(googlePlace.place_id, longitude, latitude)
          count += 1;
          }

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
        if(places[digit].gallery[0]);
        //setToken(res.next_page_token);
        return res.next_page_token
               
      }).then(function(result){
        return new Promise(resolve => {
          setTimeout(()=>{
            resolve(GooglePlacesNextPage2(result, preference, updater, ratedsentence));
          },2000)
        })
      }).then(function(result) {
         return new Promise(resolve => {
            setTimeout(()=>{
              resolve(GooglePlacesNextPage2(result, preference, updater, ratedsentence));
            },2000)
          })
        })
            /*.then(function(result) {
          
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
            let preference1 = 5;
            if (counter < preference1) {
              preference1 = counter
            }          
            
            for (var i = 0; i < counter - preference1; i += 1) {
              therealarray.pop()
            }         

            for (var i = 0; i < preference1; i += 1) {
              Restauranturl(therealarray[i].id, i, preference, preference1)
            }
          },2000)
          return
        })*/
      .catch(error => {
        setErrorMessage({"error":true})
        setNeedupdate(true)
        console.log(error);
      });
    }
    else {
      setErrorMessage({"error":true})
      setNeedupdate(false)
      setTimeout(()=> {
        setNeedupdate(true)
      },1000)
      
    }
  }
      return [SearchApi, {fillthisarray}, fillthirdarray, {therealarray}, errorMessage, needupdate, address]

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