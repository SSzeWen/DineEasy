import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView , FlatList, Image, ToastAndroid, Keyboard } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import Spacer from '../Components/Spacer';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignupScreen = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signUpToast = () => {
        ToastAndroid.show(
            'Sign Up successfully completed!',
            ToastAndroid.SHORT
        );
    };

    const missingFieldsToast = () => {
        ToastAndroid.show(
            'Missing fields, please try again!',
            ToastAndroid.SHORT
        );
    };

    const signUpHandler = () => {
        if (email.length === 0 || password.length === 0) {
            missingFieldsToast();
            return;
        }

        return createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;

                // To show the user object returned
                console.log(user);

                restoreForm();
                signUpToast();
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error('[signUpHandler]', errorCode, errorMessage);
            });
    };

    const restoreForm = () => {
        setEmail('');
        setPassword('');
        Keyboard.dismiss();
    };

    return (
    <View style={styles.container}>
        <Spacer>
            <Text h3>Sign up for Tracker</Text>
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
            <Button title="Sign up" onPress={signUpHandler
                //() =>  navigation.navigate("Login")
            }/>
        </Spacer>
        
    </View>
    );
};

SignupScreen.navigationOptions = () => {
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

export default SignupScreen;