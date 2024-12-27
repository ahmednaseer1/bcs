import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useState } from 'react';

// screens import
import WelcomeScreen from "../screens/welcomeScreen";
import LoginScreen from '../screens/loginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import RideScreen from '../screens/RideScreen';

const Stack = createNativeStackNavigator();

const Navigator = () => {

    const [loggedIn, setLoggedIn] = useState(true)

    return (
        <Stack.Navigator>
            {loggedIn ? (<>
                <Stack.Screen
                    name='HomeScreen'
                    component={HomeScreen}
                    options={{headerShown:false}}
                />
                <Stack.Screen
                    name='RideScreen'
                    component={RideScreen}
                    options={{headerShown:false}}
                />
            </>) : (<>
                <Stack.Screen
                    name="WelcomeScreen"
                    component={WelcomeScreen}
                    options={{headerShown:false}}
                />
                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={{headerShown:false}}
                />
                <Stack.Screen
                    name='Register'
                    component={RegisterScreen}
                    options={{headerShown:false}}
                />
            </>)}
        </Stack.Navigator>
    );
}



export default Navigator;