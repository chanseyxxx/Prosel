import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const HomeScreen: React.FC = () => {
  const [todosPersonagens, setTodosPersonagens] = useState<Character[]>([]);
  const [personagemSelecionado, setPersonagemSelecionado] = useState<Character | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [termoBusca, setTermoBusca] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [favoritos, setFavoritos] = useState<{ [key: number]: boolean }>({});
  const [favoritosCarregados, setFavoritosCarregados] = useState(false);
  const opacity = useState(new Animated.Value(0))[0];
  let timeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    carregarFavoritos();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (favoritosCarregados) {
      carregarPersonagens();
    }
  }, [favoritosCarregados]);

  useEffect(() => {
    if (favoritosCarregados) {
      salvarFavoritos();
    }
  }, [favoritos]);

  const carregarPersonagens = async () => {
    if (carregando || !hasMore) return;

    setCarregando(true);

    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${paginaAtual}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar os dados');
      }
      const data = await response.json();

      setTodosPersonagens((prev) => [...prev, ...data.results]);
      setHasMore(data.info.next !== null);
      setPaginaAtual((prev) => prev + 1);
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleSearch = (termo: string) => {
    setTermoBusca(termo);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      realizarBusca(termo);
    }, 300);
  };

  const realizarBusca = async (termo: string) => {
    setCarregando(true);

    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${termo}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados');
      }
      const data = await response.json();

      if (data.error) {
        setTodosPersonagens([]);
      } else {
        setTodosPersonagens(data.results);
      }
    } catch (error) {
      setTodosPersonagens([]);
    } finally {
      setCarregando(false);
    }
  };

  const resetSearch = () => {
    setTermoBusca('');
    setPaginaAtual(1);  // Reiniciar a página atual ao limpar a busca
    setTodosPersonagens([]);
    setHasMore(true);
    carregarPersonagens();
  };

  const showCharacterDetails = (character: Character) => {
    setPersonagemSelecionado(character);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideCharacterDetails = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setPersonagemSelecionado(null);
    });
  };

  const toggleFavorito = (id: number) => {
    const novosFavoritos = { ...favoritos };
    novosFavoritos[id] = !novosFavoritos[id];
    setFavoritos(novosFavoritos);
  };

  const salvarFavoritos = async () => {
    try {
      await AsyncStorage.setItem('favoritos', JSON.stringify(favoritos));
    } catch (error) {
      console.error('Erro ao salvar os favoritos:', error);
    }
  };

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

  const renderItem = ({ item }: { item: Character }) => (
    <TouchableOpacity onPress={() => showCharacterDetails(item)}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.imagem} resizeMode="cover" />
        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.nome}>{item.name}</Text>
            <Text style={styles.info}>{item.species}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleFavorito(item.id)} style={styles.heartIcon}>
            <Ionicons
              name={favoritos[item.id] ? 'heart' : 'heart-outline'}
              size={24}
              color={favoritos[item.id] ? 'red' : 'black'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    return (
      carregando && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum personagem com esse nome.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <View style={styles.tituloContainer}>
        <Image
          source={require('@/assets/images/titulo.png')}
          style={styles.tituloImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.searchBarContainer}>
        <SearchBar onSearch={handleSearch} onClear={resetSearch} />
      </View>

      {termoBusca === '' ? (
        <FlatList
          data={todosPersonagens}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          onEndReached={carregarPersonagens}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.contentContainer}
        />
      ) : (
        <FlatList
          data={todosPersonagens}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.contentContainer}
        />
      )}

      {personagemSelecionado && (
        <Animated.View style={[styles.detailContainer, { opacity }]}>
          <CharacterDetails character={personagemSelecionado} onClose={hideCharacterDetails} />
        </Animated.View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tituloContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloImage: {
    marginTop: 30,
    width: 312,
    height: 104,
  },
  searchBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
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
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  heartIcon: {
    marginLeft: 5,
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


 
