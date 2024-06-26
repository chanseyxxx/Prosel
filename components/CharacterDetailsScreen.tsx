import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function CharacterDetailScreen({ route }) {
  const { id } = route.params;

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Personagem</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
