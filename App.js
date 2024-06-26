import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/(tabs)/HomeScreen'; // Verifique o caminho correto

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Adicione outras telas aqui conforme necessário */}
    </Stack.Navigator>
  );
}

export default App;
