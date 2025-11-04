// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MailList from './screens/MailList';
import MailDetail from './screens/MailDetail';
import WebAppScreen from './screens/WebAppScreen';

// Définition des types de routes
export type RootStackParamList = {
  MailList: undefined;
  MailDetail: { mail: any };
  WebApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MailList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#563a8aff', // bleu iOS-style
          },
          headerTintColor: '#fff', // texte blanc
          headerTitleAlign: 'center', // centré
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
        }}
      >
        {/* 📬 Liste des mails */}
        <Stack.Screen
          name="MailList"
          component={MailList}
          options={{ title: 'Mail' }}
        />

        {/* 📩 Détail d’un mail */}
        <Stack.Screen
          name="MailDetail"
          component={MailDetail}
          options={{ title: 'Détails du mail' }}
        />

        {/* 🌐 App Web */}
        <Stack.Screen
          name="WebApp"
          component={WebAppScreen}
          options={{ title: 'Gestion des règles' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
