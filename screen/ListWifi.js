import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import {useNavigation} from '@react-navigation/native';
const WifiScanner = () => {
  const navigation = useNavigation();
  const [wifiList, setWifiList] = useState([]);
  const [selectedSSID, setSelectedSSID] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  // Function to scan Wi-Fi networks
  const scanWifiNetworks = () => {
    WifiManager.loadWifiList()
      .then(list => {
        setWifiList(list);
      })
      .catch(error => {
        console.error('Error scanning Wi-Fi networks:', error);
        Alert.alert('Error', 'Failed to scan Wi-Fi networks. Try again.');
      });
  };

  // Function to connect to the selected Wi-Fi network
  const connectToWifi = () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a valid password.');
      return;
    }
    WifiManager.connectToProtectedSSID(selectedSSID, password, false, false)
      .then(() => {
        Alert.alert('Success', `Connected to ${selectedSSID}!`);
        setShowPasswordInput(false);
        setPassword('');
        navigation.navigate('ImageList');
      })
      .catch(error => {
        console.error('Error connecting to Wi-Fi:', error);
        Alert.alert(
          'Error',
          'Failed to connect to the network. Check the password and try again.',
        );
      });
  };

  // Render each Wi-Fi network item
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelectedSSID(item.SSID);
        setShowPasswordInput(true);
      }}>
      <Text style={styles.itemText}>{item.SSID}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Camera Wi-Fi</Text>
      <FlatList
        data={wifiList}
        renderItem={renderItem}
        keyExtractor={item => item.BSSID}
        style={styles.flatList}
        contentContainerStyle={{paddingHorizontal: 10}}
      />
      {showPasswordInput && (
        <View style={styles.passwordContainer}>
          <Text style={styles.passwordPrompt}>
            Enter password for "{selectedSSID}"
          </Text>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={connectToWifi}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.scanButton} onPress={scanWifiNetworks}>
        <Text style={styles.scanButtonText}>Scan Wi-Fi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Roboto', // Use a custom font if available
  },
  flatList: {
    height: 300,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#6200ee',
    borderRadius: 8,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordPrompt: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  passwordInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#34a853',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WifiScanner;
