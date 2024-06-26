import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
  onSearch: (text: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear }) => {
  const [termoBusca, setTermoBusca] = useState('');

  const handleChangeText = (text: string) => {
    setTermoBusca(text);
    onSearch(text); // Chama a função de busca passada como prop
  };

  const handleClearText = () => {
    setTermoBusca('');
    onClear(); // Limpa a busca
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#000" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Filter by name...."
        placeholderTextColor="#666"
        value={termoBusca}
        onChangeText={handleChangeText}
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#000000',
    borderWidth: 1,
    opacity: 0.6, // Define 50% de opacidade para o contêiner
    width: 312,
    height: 56,
    justifyContent: 'center',

  },
  icon: {
    marginRight: 10,
    opacity: 0.6, // Define 50% de opacidade para o ícone
  },
  input: {
    fontSize: 16,
    flex: 1,
    color: '#000',
    
  },
});

export default SearchBar;
