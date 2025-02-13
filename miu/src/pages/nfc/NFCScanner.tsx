import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { Modal, Button, Text, Surface } from 'react-native-paper';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { useDispatch } from 'react-redux';
import { fetchInventoryData, updateInventory } from '@/store/tables/inventorySlice'; // Fetch and update actions

import type { InventoryData } from '@/types/tables';
import Edit from './Edit'; // Assuming Edit is the component for editing inventory data
import { useAppDispatch } from '@/store';

// Initialize NFC
NfcManager.start();

const App = () => {
  const [nfcData, setNfcData] = useState<InventoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [visible, setVisible] = useState(false);

  const dispatch = useAppDispatch();

  const toggleModal = () => setVisible(oldValue => !oldValue);

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

      if (tag && tag.id) {
        const id = parseInt(tag.id, 10); // The tag ID (converted to a number)

        // Fetch data using the ID from your database or API
        const fetchedData = await dispatch(fetchInventoryData(id)).unwrap();

        setNfcData(fetchedData);
        Alert.alert("NFC Tag Read", `Inventory data for ID ${id} fetched.`);
      } else {
        setError("No ID found on NFC tag");
        Alert.alert("Error", "No ID found on NFC tag.");
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
    <Surface style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Text>NFC Reader</Text>
      <Button mode="contained" onPress={readNfcTag} disabled={scanning}>
        Scan NFC Tag
      </Button>
      {nfcData && <Text style={{ marginTop: 20 }}>Data: {nfcData.id}</Text>}
      {error && <Text style={{ marginTop: 20, color: 'red' }}>{error}</Text>}

      <Button mode="contained" onPress={toggleModal}>
        Show Modal
      </Button>
      <Modal 
        visible={visible} 
        onDismiss={toggleModal} 
        contentContainerStyle={{ padding: 20, margin: 20, borderRadius: 10 }}
      >
        <Surface style={{ padding: 20, borderRadius: 10, gap: 10 }}>
          {nfcData && (
            <Edit 
              toggleModal={toggleModal}
              setId={(id: number) => {
                setNfcData({ ...nfcData, id });
              }}
              data={nfcData} // Pass fetched data to the Edit component for editing
            />
          )}
          <Button onPress={toggleModal}>Close</Button>
        </Surface>
      </Modal>
    </Surface>
  );
};

export default App;
