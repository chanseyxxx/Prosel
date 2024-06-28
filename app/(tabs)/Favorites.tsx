import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import AppBar from '@/components/AppBar';
import SearchBar from '@/components/SearchBar';
import CharacterDetails from '@/components/CharacterDetails';

type Character = {
  id: number;
  name: string;
  species: string;
  image: string;
  status: string;
  gender: string;
  type: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
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
    // Impedir de desmarcar como favorito
    if (favoritos[id]) {
      return;
    }

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
    if (termo === '') {
      carregarPersonagensFavoritos();
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${termo}`);
      if (!response.ok) {
        setTodosPersonagens([]);
        return;
      }
      const data = await response.json();
      const personagensFiltrados = data.results.filter((personagem: Character) => favoritos[personagem.id]);
      setTodosPersonagens(personagensFiltrados);
    } catch (error) {
      console.error('Erro na busca:', error);
      setTodosPersonagens([]);
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

  const hideCharacterDetails = () => {
    setPersonagemSelecionado(null);
  };

  const renderItem = ({ item }: { item: Character }) => (
    <TouchableOpacity onPress={() => showCharacterDetails(item)}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.imagem} resizeMode="cover" />
        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.nome}>{item.name}</Text>
            <Text style={styles.info}>{item.species}</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleFavorito(item.id)}
            style={[styles.heartIcon, favoritos[item.id] && styles.disabledHeartIcon]}
            disabled={favoritos[item.id]} // Desabilita o ícone quando favoritado
          >
            <Ionicons
              name={favoritos[item.id] ? 'heart' : 'heart-outline'}
              size={25}
              color={favoritos[item.id] ? 'red' : 'black'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppBar />
      <View style={styles.searchBarContainer}>
        <SearchBar onSearch={handleSearch} onClear={resetSearch} />
      </View>

      {personagemSelecionado && (
        <View style={styles.detailContainer}>
          <TouchableOpacity onPress={hideCharacterDetails} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Fechar Detalhes</Text>
          </TouchableOpacity>
          <CharacterDetails character={personagemSelecionado} onClose={hideCharacterDetails} />
        </View>
      )}

      <FlatList
        data={todosPersonagens}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text>Nenhum personagem encontrado ou favoritado.</Text>}
      />
    </View>
  );
};

export default FavoritosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  searchBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    alignItems: 'center',
    width: 312,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
  },
  imagem: {
    width: 312,
    height: 288,
    borderRadius: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  textContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
  },
  heartIcon: {
    marginLeft: 5,
  },
  disabledHeartIcon: {
    opacity: 0.5, // Opacidade reduzida para indicar que está desabilitado
  },
  loader: {
    marginTop: 10,
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  detailContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
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
