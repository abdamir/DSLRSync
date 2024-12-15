import TcpSocket from 'react-native-tcp-socket';
import {Buffer} from 'buffer';
// PTP/IP Operation Codes
const PTP_COMMANDS = {
  OPEN_SESSION: 0x1002,
  CLOSE_SESSION: 0x1003,
  GET_STORAGE_IDS: 0x1004,
  GET_STORAGE_INFO: 0x1005,
  GET_OBJECT_HANDLES: 0x1007,
  GET_OBJECT: 0x1009,
};

// Generate a PTP/IP packet for a command
const createPTPPacket = (operationCode, transactionID, parameters = []) => {
  const paramCount = parameters.length;
  const packetLength = 12 + paramCount * 4;

  const buffer = Buffer.alloc(packetLength);

  // Packet length
  buffer.writeUInt32LE(packetLength, 0);
  // Operation Code
  buffer.writeUInt16LE(operationCode, 4);
  // Transaction ID
  buffer.writeUInt32LE(transactionID, 8);

  // Parameters
  for (let i = 0; i < paramCount; i++) {
    buffer.writeUInt32LE(parameters[i], 12 + i * 4);
  }

  return buffer;
};

const connectToCamera = ip => {
  const transactionID = 1; // Increment for each command
  const client = TcpSocket.createConnection({
    host: ip, // Camera's IP address
    port: 15740, // Default port for Canon PTP/IP
  });

  client.on('connect', () => {
    console.log('Connected to the camera');

    // Open Session
    const openSessionPacket = createPTPPacket(
      PTP_COMMANDS.OPEN_SESSION,
      transactionID,
      [1], // Session ID
    );

    client.write(openSessionPacket);

    console.log('Sent OpenSession command');

    // Wait a bit before expecting the response (e.g., 2 seconds)
    setTimeout(() => {
      console.log('Checking for response...');
      // If response hasn't been received by now, you can log or handle timeout
    }, 2000); 
  });

  client.on('data', data => {
    console.log('Raw Data (Hex):', data.toString('hex'));

    // Example: Read the Response Code from the known offset
    const responseCode = data.readUInt16LE(10); // Adjust offset as needed
    console.log('Parsed Response Code:', responseCode.toString(16));
    /* console.log('Received data:', data);

    // Parse and handle responses
    const responseCode = data.readUInt16LE(4);
    console.log('Response Code:', responseCode);

    if (responseCode === 0x2001) {
      console.log('Session opened successfully');

      // Send GetObjectHandles command to get image file handles
      const getObjectHandlesPacket = createPTPPacket(
        PTP_COMMANDS.GET_OBJECT_HANDLES,
        transactionID + 1,
        [0xFFFFFFFF, 0, 0] // StorageID, FormatCode, AssociationHandle
      );

      client.write(getObjectHandlesPacket);
      console.log('Sent GetObjectHandles command');
    } else if (responseCode === 0x2005) {
      console.log('Received object handles');

      // Extract object handles (file IDs)
      const fileIDs = [];
      for (let i = 12; i < data.length; i += 4) {
        fileIDs.push(data.readUInt32LE(i));
      }

      console.log('File IDs:', fileIDs);

      if (fileIDs.length > 0) {
        // Download the first file as an example
        const getObjectPacket = createPTPPacket(
          PTP_COMMANDS.GET_OBJECT,
          transactionID + 2,
          [fileIDs[0]] // ObjectHandle
        );

        client.write(getObjectPacket);
        console.log('Sent GetObject command for file ID:', fileIDs[0]);
      }
    } else if (responseCode === 0x2009) {
      console.log('Received file data');
      // Save or process image data
      saveImage(data.slice(12)); // Remove PTP header
    }*/
  });

  client.on('error', error => {
    console.error('Socket error:', error);
  });

  client.on('close', () => {
    console.log('Connection closed');
  });
};

// Helper function to save image data
import RNFS from 'react-native-fs';

const saveImage = data => {
  const filePath = `${RNFS.DocumentDirectoryPath}/image.jpg`;
  RNFS.writeFile(filePath, data.toString('base64'), 'base64')
    .then(() => {
      console.log('Image saved at:', filePath);
    })
    .catch(err => {
      console.error('Error saving image:', err);
    });
};

export default connectToCamera;
