import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import AppBar from '@/components/AppBar';
import SearchBar from '@/components/SearchBar';

type Character = {
  id: number;
  name: string;
  species: string;
  image: string;
  status: string;
  gender: string;
};

const FavoritosScreen: React.FC = () => {
  const [todosPersonagens, setTodosPersonagens] = useState<Character[]>([]);
  const [favoritos, setFavoritos] = useState<{ [key: number]: boolean }>({});
  const [favoritosCarregados, setFavoritosCarregados] = useState(false);
  const [personagemSelecionado, setPersonagemSelecionado] = useState<Character | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const carregarFavoritos = async () => {
        try {
          const favoritosSalvos = await AsyncStorage.getItem('favoritos');
          if (favoritosSalvos) {
            setFavoritos(JSON.parse(favoritosSalvos));
          }
          setFavoritosCarregados(true);
        } catch (error) {
          console.error('Erro ao carregar os favoritos:', error);
        }
      };

      carregarFavoritos();
    }, [])
  );

  useEffect(() => {
    if (favoritosCarregados) {
      carregarPersonagensFavoritos();
    }
  }, [favoritosCarregados, favoritos]);

  const carregarPersonagensFavoritos = async () => {
    const idsFavoritos = Object.keys(favoritos).filter(id => favoritos[Number(id)]);
    if (idsFavoritos.length === 0) {
      setTodosPersonagens([]);
      return;
    }

    try {
      const promises = idsFavoritos.map(id =>
        fetch(`https://rickandmortyapi.com/api/character/${id}`).then(response => response.json())
      );
      const personagensFavoritos = await Promise.all(promises);
      setTodosPersonagens(personagensFavoritos);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const toggleFavorito = async (id: number) => {
    const novosFavoritos = { ...favoritos };
    novosFavoritos[id] = !novosFavoritos[id];
    setFavoritos(novosFavoritos);
    await AsyncStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
  };

  const handleSearch = (termo: string) => {
    setTermoBusca(termo);
    realizarBusca(termo);
  };

  const realizarBusca = async (termo: string) => {
    setCarregando(true);

    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${termo}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados');
      }
      const data = await response.json();
      const personagensFiltrados = data.results.filter((personagem: Character) => favoritos[personagem.id]);
      setTodosPersonagens(personagensFiltrados);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setCarregando(false);
    }
  };

  const resetSearch = () => {
    setTermoBusca('');
    carregarPersonagensFavoritos();
  };

  const showCharacterDetails = (character: Character) => {
    setPersonagemSelecionado(character);
  };

  const renderItem = ({ item }: { item: Character }) => (
    <TouchableOpacity onPress={() => showCharacterDetails(item)}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.imagem} resizeMode="cover" />
        <View style={styles.infoContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.nome}>{item.name}</Text>
            <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
              <Ionicons
                name={favoritos[item.id] ? 'heart' : 'heart-outline'}
                size={24}
                color={favoritos[item.id] ? 'red' : 'black'}
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.info}>{item.species}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppBar />
      <Text style={styles.titulo}>Personagens Favoritos</Text>
      <SearchBar onSearch={handleSearch} onClear={resetSearch} />
      
      {personagemSelecionado ? (
        <View style={styles.detailContainer}>
          <TouchableOpacity onPress={() => setPersonagemSelecionado(null)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Fechar Detalhes</Text>
          </TouchableOpacity>
          <View style={styles.detailContent}>
            <Image source={{ uri: personagemSelecionado.image }} style={styles.detailImage} resizeMode="cover" />
            <View style={styles.infoContainer}>
              <Text style={styles.nome}>{personagemSelecionado.name}</Text>
              <Text style={styles.info}>{personagemSelecionado.status}</Text>
              <Text style={styles.info}>{personagemSelecionado.gender}</Text>
              <Text style={styles.info}>{personagemSelecionado.species}</Text>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={todosPersonagens}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhum personagem favoritado.</Text>}
        />
      )}
    </View>
  );
};

export default FavoritosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 5,
  },
  infoContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  detailContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  detailImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
