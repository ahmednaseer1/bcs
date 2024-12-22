import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';


// navigation component
import Navigator from './components/navigator';

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Navigator/>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == "android"? StatusBar.
    currentHeight : 0,
  },
});
