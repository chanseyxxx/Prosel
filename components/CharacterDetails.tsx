import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppBar from '@/components/AppBar';

interface CharacterDetailsProps {
  character: {
    name: string;
    image: string;
    species: string;
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
  onClose: () => void;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ character, onClose }) => {
  const getCharacterDetail = (detail: string | undefined) => detail || 'Unknown';

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <AppBar />
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="arrow-back" size={20} color="#000" />
        <Text style={styles.closeButtonText}>GO BACK</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.detailContent}>
          <Image source={{ uri: character.image }} style={styles.detailImage} resizeMode="cover" />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{character.name}</Text>
            <Text style={styles.infomation}>Informations</Text>

            <Text style={styles.title}>Gender</Text>
            <Text style={styles.text}>{getCharacterDetail(character.gender)}</Text>
            <View style={styles.divider} />

            <Text style={styles.title}>Status</Text>
            <Text style={styles.text}>{getCharacterDetail(character.status)}</Text>
            <View style={styles.divider} />

            <Text style={styles.title}>Specie</Text>
            <Text style={styles.text}>{getCharacterDetail(character.species)}</Text>
            <View style={styles.divider} />

            <Text style={styles.title}>Origin</Text>
            <Text style={styles.text}>{getCharacterDetail(character.origin.name)}</Text>
            <View style={styles.divider} />

            <Text style={styles.title}>Type</Text>
            <Text style={styles.text}>{getCharacterDetail(character.type)}</Text>
            <View style={styles.divider} />
            
            <Text style={styles.title}>Location</Text>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{getCharacterDetail(character.location.name)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  detailContent: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  detailImage: {
    width: 146,
    height: 148,
    borderRadius: 150,
    borderColor: '#F2F2F7',
    borderWidth: 5,
  },
  infoContainer: {
    marginTop: 10,
    width: 312,
  },
  name: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
  },
  infomation: {
    fontSize: 20,
    color: '#8E8E93',
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    color: '#6E798C',
  },
  closeButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft:25,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  title: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 10,
    opacity: 0.2,
  },
});

export default CharacterDetails;
