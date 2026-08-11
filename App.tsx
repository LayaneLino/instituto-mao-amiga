import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import TelaListaPontos from './TelaListaPontos'; 
import TelaDetalhePonto from './TelaDetalhePonto';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F8" />
      
      <TelaDetalhePonto />
      {/*Para ver a outra tela: <TelaDetalhePonto /> */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
});