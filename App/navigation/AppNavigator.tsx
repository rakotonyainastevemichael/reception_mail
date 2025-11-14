// /home/steve/stage/N8n_mail/App/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Écrans existants
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import MailList from '../screens/MailList';
import MailDetail from '../screens/MailDetail';
import WebAppScreen from '../screens/WebAppScreen';

// Nouveaux écrans
import Assistant from '../screens/Assistant';
import Planning from '../screens/Planning';
import Contacts from '../screens/Contacts';
import ResetPassword from '../screens/ResetPassword'; // nouvel écran


export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MailList: undefined;
  MailDetail: { mail: any };
  WebApp: undefined;
  Assistant: undefined;
  Planning: undefined;
  Contacts: undefined;
  Rules: undefined;
  ResetPassword: { access_token?: string }; // token fourni par Supabase
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MailList" component={MailList} />
        <Stack.Screen name="MailDetail" component={MailDetail} />
        <Stack.Screen name="WebApp" component={WebAppScreen} />
        <Stack.Screen name="Assistant" component={Assistant} />
        <Stack.Screen name="Planning" component={Planning} />
        <Stack.Screen name="Contacts" component={Contacts} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
