import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, PermissionsAndroid } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// Function to request NFC and Location permissions at runtime
const requestPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.NFC, 
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    // Check if NFC and location permissions are granted
    if (
      granted[PermissionsAndroid.PERMISSIONS.NFC] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log("Permissions granted");
      return true;
    } else {
      console.log("Permissions denied");
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const NfcReader: React.FC = () => {
  const [hasNfc, setHasNfc] = useState<boolean | null>(null);
  const [tagData, setTagData] = useState<string | null>(null);

  useEffect(() => {
    const checkNfc = async () => {
      const supported = await NfcManager.isSupported();
      setHasNfc(supported);

      if (supported) {
        const permissionGranted = await requestPermissions(); // Request permissions when NFC is supported
        if (permissionGranted) {
          try {
            console.log('Starting NFC Manager...');
            await NfcManager.start();
            console.log('NFC Manager started');
          } catch (error) {
            console.error('Failed to start NFC Manager:', error);
          }
        } else {
          console.error("Permissions not granted.");
        }
      }
    };

    checkNfc();

    return () => {
      // Cleanup NFC manager when the component unmounts
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  const readNfc = async () => {
    try {
      // Request permission to use NFC
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Read the tag data
      const tag = await NfcManager.getTag();
      const ndefMessage = tag?.ndefMessage;

      if (ndefMessage && ndefMessage[0]?.payload) {
        // Convert payload to Uint8Array
        const payload = new Uint8Array(ndefMessage[0].payload as any);
        const text = Ndef.text.decodePayload(payload);
        setTagData(text);
      } else {
        setTagData('No data found on the tag.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to read NFC tag.');
    } finally {
      // Cleanup after reading
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={styles.container}>
      {hasNfc === null && <Text>Checking NFC support...</Text>}
      {hasNfc === false && <Text>NFC is not supported on this device.</Text>}
      {hasNfc && (
        <>
          <Text style={styles.text}>
            {tagData ? `Tag Data: ${tagData}` : 'Scan an NFC tag'}
          </Text>
          <Button title="Scan NFC Tag" onPress={readNfc} />
        </>
      )}
    </View>
  );
};

export default NfcReader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
});
