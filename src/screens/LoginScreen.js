import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView , FlatList, Image, ToastAndroid,
    Keyboard,} from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import Spacer from '../Components/Spacer';
import Currentlocation from '../Components/Currentlocation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import useGooglePlaces1 from '../Components/useGooglePlaces1';
import * as RootNavigation from '../RootNavigation'


const LoginScreen = ({ navigation }) => {
    const [islogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const missingFieldsToast = () => {
        ToastAndroid.show(
            'Missing fields, please try again!',
            ToastAndroid.SHORT
        );
    };

    const loginHandler = () => {
        if (email.length === 0 || password.length === 0) {
            missingFieldsToast();
            return;
        }

        return signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;

                // To show the user object returned
                console.log(user);

                restoreForm();
                setIsLogin(true);
                        
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error('[loginHandler]', errorCode, errorMessage);
            });
    };

    const restoreForm = () => {
        setEmail('');
        setPassword('');
        Keyboard.dismiss();
    };


    useEffect(() => {
        if(islogin === true) {
            return RootNavigation.navigate("Main", { screen: "Home"})
            
        }
    })
    
    return (
        Currentlocation(),
        //useGooglePlaces1(),

        <View style={styles.container}>
            <Spacer>
                <Text h3>Login</Text>
            </Spacer>
            <Input 
                label="Email" 
                value={email} 
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false} 
            />
            <Spacer />
            <Input 
                secureTextEntry
                label="Password" 
                value={password} 
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false} 
    
            />
            <Spacer>
                <Button title="Login" onPress={loginHandler}/>
            </Spacer>
            <Spacer>
                <Button title="Sign Up" onPress={() => RootNavigation.navigate("Auth", { screen : "Sign up"})}/>
            </Spacer>
            
        </View>
        );
    };
    
    LoginScreen.navigationOptions = () => {
      return {
        headerShown: false,
      };
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            marginBottom: 200
        }
    });
    
    export default LoginScreen;