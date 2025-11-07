import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MailList from '../screens/MailList';
import MailDetail from '../screens/MailDetail';
import WebAppScreen from '../screens/WebAppScreen';
import Login from '../screens/Login';
import Signup from '../screens/Signup';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MailList: undefined;
  MailDetail: { mail: any };
  WebApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MailList" component={MailList} />
        <Stack.Screen name="MailDetail" component={MailDetail} />
        <Stack.Screen name="WebApp" component={WebAppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
