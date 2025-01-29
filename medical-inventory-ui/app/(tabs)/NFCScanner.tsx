import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// Initialize NFC
NfcManager.start();

const App = () => {
  const [nfcData, setNfcData] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    return () => {
      NfcManager.cancelTechnologyRequest(); // Cleanup on unmount
    };
  }, []);

  const readNfcTag = async () => {
    try {
      setScanning(true);

      // Request NFC reader mode
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Get the NFC tag data
      const tag = await NfcManager.getTag();

      if (tag && tag.ndefMessage) {
        // Decode NFC NDEF message safely
        const ndefRecords = tag.ndefMessage.map(record => {
          if (record.payload instanceof Uint8Array) {
            return Ndef.text.decodePayload(record.payload); // ✅ Safe decoding
          } else {
            return Ndef.text.decodePayload(new Uint8Array(record.payload)); // ✅ Convert to Uint8Array if necessary
          }
        });

        setNfcData(ndefRecords.join('\n'));
        Alert.alert("NFC Tag Read", ndefRecords.join('\n'));
      } else {
        setNfcData("No NDEF message found");
        Alert.alert("Error", "No NDEF message found");
      }

    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message || "Failed to read NFC tag.");
      } else {
        Alert.alert("Error", "Failed to read NFC tag.");
      }
    } finally {
      setScanning(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>NFC Reader</Text>
      <Button title="Scan NFC Tag" onPress={readNfcTag} disabled={scanning} />
      {nfcData && <Text style={{ marginTop: 20 }}>Data: {nfcData}</Text>}
    </View>
  );
};

export default App;
