import dgram from 'react-native-udp';
import {Buffer} from 'buffer';

// Set up SSDP message
const StartUDPConnection = () => {
  const message = Buffer.from(
    `M-SEARCH * HTTP/1.1\r\n` +
      `HOST: 239.255.255.250:1900\r\n` +
      `MAN: "ssdp:discover"\r\n` +
      `MX: 1\r\n` +
      `ST: urn:schemas-sony-com:service:ScalarWebAPI:1\r\n` +
      `USER-AGENT: ReactNative/1.0 UPnP/1.1 SonyCameraApp/1.0\r\n\r\n`,
  );

  // Create a UDP socket
  const socket = dgram.createSocket('udp4');

  socket.on('message', (msg, rinfo) => {
    console.log(`Message from ${rinfo.address}:${rinfo.port}`);
    console.log(msg.toString());
  });

  socket.on('error', err => {
    console.error(`Socket error: ${err.message}`);
    socket.close();
  });

  // Send SSDP discovery message
  socket.bind(() => {
    socket.setBroadcast(true);
    socket.send(message, 0, message.length, 1900, '239.255.255.250', err => {
      if (err) {
        console.error(`Send error: ${err}`);
      } else {
        console.log('SSDP M-SEARCH message sent');
      }
    });
  });
};
export default StartUDPConnection;