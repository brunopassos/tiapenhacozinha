import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import Dashboard from './src/screens/Dashboard';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Dashboard/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  }
})