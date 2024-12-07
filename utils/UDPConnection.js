//Sony UDP Connection
import dgram from 'react-native-udp';
import {Buffer} from 'buffer';
// Explicitly use Buffer from Node.js
export const StartUDPConnection = () => {
  console.log('here');
  const message = Buffer.from(
    `M-SEARCH * HTTP/1.1\r\n` +
      `HOST: 239.255.255.250:1900\r\n` +
      `MAN: "ssdp:discover"\r\n` +
      `MX: 1\r\n` +
      `ST: urn:schemas-sony-com:service:ScalarWebAPI:1\r\n` +
      `USER-AGENT: Node.js/14.0 UPnP/1.1 SonyCameraApp/1.0\r\n\r\n`,
  );

  const client = dgram.createSocket('udp4');

  client.on('message', (msg, rinfo) => {
    console.log(`Received response from ${rinfo.address}:${rinfo.port}`);
    console.log(msg.toString());
  });

  client.on('error', err => {
    console.error(`Socket error: ${err}`);
    client.close();
  });

  client.send(message, 0, message.length, 1900, '239.255.255.250', err => {
    if (err) {
      console.error(`Send error: ${err}`);
    } else {
      console.log('SSDP M-SEARCH message sent');
    }
  });
};

