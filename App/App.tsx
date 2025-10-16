// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MailList from './screens/MailList';
import MailDetail from './screens/MailDetail';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MailList">
        <Stack.Screen name="MailList" component={MailList} options={{ title: 'Mails' }} />
        <Stack.Screen name="MailDetail" component={MailDetail} options={{ title: 'Détails du mail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
