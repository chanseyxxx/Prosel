import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ onSearch, onClear }) => {
  const [termoBusca, setTermoBusca] = useState('');

  const handleChangeText = (text) => {
    setTermoBusca(text);
    onSearch(text); // Chama a função de busca passada como prop
  };

  const handleClearText = () => {
    setTermoBusca('');
    onClear(); // Limpa a busca
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua busca"
        value={termoBusca}
        onChangeText={handleChangeText}
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

export default SearchBar;
