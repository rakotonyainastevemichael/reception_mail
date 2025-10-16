// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MailScreen from '../screens/MailList';

export type RootStackParamList = {
  Mails: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Mails" component={MailScreen} options={{ title: 'Messagerie' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
