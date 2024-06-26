import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const AppBar = () => {
  return (
    <View style={styles.appBar}>
      <Image
          source={require('@/assets/images/logo.png')}  // Substitua pelo seu ícone
          style={styles.menuIcon}
          resizeMode="contain"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuIcon: {
    flex: 1,
    alignItems: 'center',
    width: 50,
    height: 50,
  }
  
});

export default AppBar;
