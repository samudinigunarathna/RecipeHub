import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeDatabase } from './src/database/database';

export default function App() {
  const [databaseReady, setDatabaseReady] = React.useState(false);
  const [databaseError, setDatabaseError] = React.useState(null);
  
  useEffect(() => {
    async function setupDatabase() {
      try {
        await initializeDatabase();
        setDatabaseReady(true);
      } catch (error) {
        setDatabaseError(error.message);
        console.error('Error initialization failed!', error);
      }
    }

    setupDatabase();
  }, []);

  if (databaseError) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        padding:20
      }}>
        <Text>Error initializing database: {databaseError}</Text>
      </View>
    );
  }

  if(!databaseReady) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>Preparing RecipeHub...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}