// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MailList from '../screens/MailList';
import MailDetail from '../screens/MailDetail';
import WebAppScreen from '../screens/WebAppScreen';

export type RootStackParamList = {
  MailList: undefined;
  MailDetail: { mail: any };
  WebApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MailList" component={MailList} />
        <Stack.Screen name="MailDetail" component={MailDetail} />
        <Stack.Screen name="WebApp" component={WebAppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
