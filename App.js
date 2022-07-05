//import { createAppContainer, createSwitchNavigator } from 'react-navigation';
//import { createStackNavigator } from 'react-navigation-stack';
//import { createDrawerNavigator } from 'react-navigation-drawer';
import SearchScreen from './src/screens/SearchScreen';
import ResultShowScreen from './src/screens/ResultsShowScreen';
import SignupScreen from './src/screens/SignupScreen';
import SavedResultsScreen from './src/screens/SavedResultsScreen';
import RatedResultsScreen from './src/screens/RatedResultsScreen';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import LoginScreen from './src/screens/LoginScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SearchScreenGoogle from './src/screens/SearchScreenGoogle';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { navigationRef } from './src/RootNavigation';
import { LogBox } from 'react-native'
import useGooglePlaces1 from './src/Components/useGooglePlaces1';
import RatingScreen from './src/screens/RatingScreen';
import DirectionScreen from './src/screens/DirectionScreen'
import FilterScreen from './src/screens/FilterScreen'

//LogBox.ignoreLogs(["Warning: AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]);
LogBox.ignoreAllLogs();
//import * as Location from 'expo-location';

/*
const newNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Login: LoginScreen,
    Signup: SignupScreen
  }),
  mainFlow: createBottomTabNavigator({
    restaurantFlow: createStackNavigator({
      Search: SearchScreen,
      Search1: SearchScreenGoogle,
      ResultsShow: ResultShowScreen
    }),
    SavedResults: SavedResultsScreen,
    RatedResults: RatedResultsScreen
  }, 
  {
    drawerLockMode: 'unlocked'
  })
})

export default createAppContainer(newNavigator);
*/

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const AuthStack = createNativeStackNavigator();

const AppStack = createNativeStackNavigator();


const RestaurantFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen component={SearchScreen} name="Search" options={{ headerShown: false }}/>
      <Stack.Screen component={ResultShowScreen} name="ResultsShow" />
      <Stack.Screen component={RatingScreen} name="Rating"/>
      <Stack.Screen component={DirectionScreen} name='DirectionsAPI'/>
      <Stack.Screen component={FilterScreen} name = 'Filter'/>
    </Stack.Navigator>
  )
}


const Main = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={RestaurantFlow} options={{ headerShown: false }}/>
      <Drawer.Screen name="Saved Restaurants" component={SavedResultsScreen} />
      <Drawer.Screen name="Rated Restaurants" component={RatedResultsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  )
};

const Auth = () => {
  return (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Sign up" component={SignupScreen} />
    </AuthStack.Navigator>
  )
}

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <AppStack.Screen name="Auth" component={Auth} />
        <AppStack.Screen name="Main" component={Main} />
      </AppStack.Navigator>
    </NavigationContainer>
  )
};

export default App;