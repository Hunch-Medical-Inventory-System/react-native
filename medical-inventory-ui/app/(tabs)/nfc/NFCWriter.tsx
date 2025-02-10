import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Button, Text, Surface, Modal } from 'react-native-paper';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

import type { InventoryData } from '@/app/types/tables';
import Data from './Create';  // Make sure to import Data

// Initialize NFC
NfcManager.start();

const App = () => {
  const [writing, setWriting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [nfcData, setNfcData] = useState<number>(0);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const writeNfcTag = async () => {
    try {
      setWriting(true);
      
      // Request NFC writing capability
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      // Convert object to JSON string
      const jsonString = JSON.stringify(nfcData);

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
    <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text variant="headlineMedium">NFC Writer</Text>
      
      {/* Button to open the modal */}
      <Button
        mode="outlined"
        onPress={showModal}
        style={{ marginTop: 20, width: '80%' }}
      >
        Edit Data
      </Button>
      
      {/* Button to write the data to the NFC tag */}
      <Button
        mode="contained"
        onPress={writeNfcTag}
        disabled={writing}
        style={{
          marginTop: 20,
          paddingVertical: 10,
          width: '80%',
        }}
      >
        Write NFC Tag
      </Button>

      {/* Modal for editing data */}
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{ padding: 20, margin: 20, borderRadius: 10 }}>
        <Surface style={{ padding: 20, borderRadius: 10, gap: 10 }}>
          {/* Pass nfcData to the Data component for editing */}
          <Data setVisible={setVisible} setId={setNfcData} />
          <Button mode="contained" onPress={hideModal}>
            Save
          </Button>
        </Surface>
      </Modal>
      
      {writing && <Text style={{ marginTop: 20 }}>Writing to NFC...</Text>}
    </Surface>
  );
};

export default App;
