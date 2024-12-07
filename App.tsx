import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import {NetworkInfo} from 'react-native-network-info';
import StartUDPConnection from './utils/UDPConnection';

const WifiScanner = () => {
  const sendRequest = (url: any, method: any, body: any) => {
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.error('Error:', error));
  };
  const requestPermissions = async () => {
    if (Platform.OS === 'android' && !WifiManager.isEnabled()) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Wi-Fi Scan Permission',
            message:
              'We need access to your location to scan for Wi-Fi networks.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
          ToastAndroid.show('Permission Denied', ToastAndroid.SHORT);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const requestPermissions2 = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const requestPermissions3 = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const scanWifi = () => {
    requestPermissions();
    requestPermissions2();

    WifiManager.loadWifiList()
      .then(wifiList1 => {
        console.log(wifiList1);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const [ipAddress, setipAddress] = useState('');
  const connectToWifi = ssid => {
    WifiManager.connectToProtectedSSID(ssid, 'g9cjgHrJ', false, false)
      .then(() => {
        ToastAndroid.show('Connected to ' + ssid, ToastAndroid.SHORT);
        console.log('Successfully connected to:', ssid);

        // Get the Gateway IP Address
        /* NetworkInfo.getGatewayIPAddress()
          .then(ipAddress => {
            setipAddress(ipAddress);
            console.log('Camera IP Address:', ipAddress);
            ToastAndroid.show('Camera IP: ' + ipAddress, ToastAndroid.SHORT);

            // You can save or use the IP address here for further communication.
          })
          .catch(error => {
            console.error('Error getting gateway IP:', error);
          });*/
      })
      .catch(error => {
        console.error('Failed to connect to Wi-Fi:', error);
        ToastAndroid.show('Connection failed', ToastAndroid.SHORT);
      });
  };

  const [WIFIList, setWIFIList] = useState([]);
  const scanWiFiNetworks = () => {
    requestPermissions3();
    WifiManager.loadWifiList().then(list => {
      console.log(list[0]);
      setWIFIList(list);
    });
  };
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => connectToWifi(item.SSID)}
      style={styles.item}>
      <Text style={styles.text}>{item.SSID}</Text>
    </TouchableOpacity>
  );
  return (
    <View>
      <Text>Wi-Fi Networks (Camera Only)</Text>
      <Text>{ipAddress}</Text>
      <FlatList
        data={WIFIList}
        renderItem={renderItem}
        keyExtractor={item => item.BSSID}
        style={styles.flatList}
      />

      <Button title={'Scan Wi-Fi'} onPress={scanWiFiNetworks} />
      <Button title={'Clear'} onPress={() => setWIFIList([])} />
      <Button
        title={'send request to sony camera'}
        onPress={() => {
          console.log('here');
          StartUDPConnection();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  flatList: {
    maxHeight: 600, // Limit the height to 200 pixels
  },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
export default WifiScanner;
