import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// Initialize NFC
NfcManager.start();

const App = () => {
  const [writing, setWriting] = useState(false);

  const writeNfcTag = async () => {
    try {
      setWriting(true);
      
      // Request NFC writing capability
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      // Create an object to write
      const myObject = {
        id: 1,
        name: "React Native NFC",
        timestamp: new Date().toISOString(),
      };

      // Convert object to JSON string
      const jsonString = JSON.stringify(myObject);

      // Encode JSON string into NFC NDEF format
      const bytes = Ndef.encodeMessage([
        Ndef.textRecord(jsonString),
      ]);

      if (!bytes) throw new Error("NDEF encoding failed");

      // Write to NFC tag
      await NfcManager.ndefHandler.writeNdefMessage(bytes);

      Alert.alert("Success", "NFC Tag Written Successfully!");

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to write NFC tag.";
      Alert.alert("Error", errorMessage);
    } finally {
      setWriting(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>NFC Writer</Text>
      <Button title="Write NFC Tag" onPress={writeNfcTag} disabled={writing} />
    </View>
  );
};

export default App;
