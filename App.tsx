import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './screen/LoginScreen'; // Adjust the path based on your file structure
import HomeScreen from './screen/HomeScreen'; // Add this component
import WifiScanner from './screen/ListWifi';
import ImageList from './screen/ImageList';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Welcome"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WifiScanner"
          component={WifiScanner}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="ImageList"
          component={ImageList}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
