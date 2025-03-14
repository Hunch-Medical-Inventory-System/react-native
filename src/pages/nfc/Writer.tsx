import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Button, Surface, Modal, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import Create from '@/components/inventory/Create';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import { retrieveInventory } from '@/store/tables/inventorySlice';

import type { InventoryData } from '@/types/tables';
import type { RootState, AppDispatch } from '@/store';

// Initialize NFC
NfcManager.start();

const Writer = () => {
  const [writing, setWriting] = useState(false);
  const [visible, setVisible] = useState(true);
  const [nfcData, setNfcData] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isNfcSupported, setIsNfcSupported] = useState(false);

  const toggleModal = () => setVisible(oldValue => !oldValue);

  const dispatch: AppDispatch = useAppDispatch();
  const { active, loading, error: inventoryError } = useSelector(
    (state: RootState) => state.inventory
  );

  const fetchInventory = () => {
    dispatch(retrieveInventory({
      itemsPerPage: 100,
      page: 1,
      keywords: '',
    })).unwrap().catch((err) => console.error('Error fetching inventory:', err));
  };

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: '' }));
    fetchInventory();
  }, [dispatch]);

  const confirmWrite = () => {

    Alert.alert(
      "Confirm Write",
      "Are you sure you want to write to the NFC tag?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Write",
          onPress: writeNfcTag,
        },
      ]
    )
  };


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

  // Check if NFC is supported and enabled on the device
  useEffect(() => {
      const checkNfcSupport = async () => {
        try {
          const isSupported = await NfcManager.isSupported();
          setIsNfcSupported(isSupported);
        } catch (error) {
          setError('Error checking NFC support.');
          setIsNfcSupported(false);
        }
      };

      checkNfcSupport();

      return () => {
        NfcManager.cancelTechnologyRequest();
      };
    }, []);

  if (!isNfcSupported) {
    return (
      <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text variant="headlineMedium">NFC Not Supported</Text>
        <Text style={{ marginTop: 10 }}>
          This device does not support NFC functionality.
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      // flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20 ,
      gap: 10
    }}>

      <Text variant="headlineMedium">NFC Writer</Text>
      {writing && <Text style={{ marginTop: 20 }}>Writing to NFC...</Text>}

      {error && <Text style={{ marginTop: 20, color: 'red' }}>{error}</Text>}

      {/* Button to open the modal */}
      <Button
        mode="outlined"
        onPress={toggleModal}
        style={{ marginTop: 20, width: '80%' }}
      >
        Edit Data
      </Button>

      {/* Dropdown to select existing data to rewrite in case of tag damage*/}
      <Surface style={{ width: '80%'}}>
        <Dropdown
          label="Select Data"
          placeholder="Select Data"
          value={active.data.find((item: InventoryData) => item.id === nfcData)?.id?.toString() ?? ''}
          onSelect={(value?: string) => setNfcData(value ? Number(value) : 0)}
          options={active.data.map((item: InventoryData) => ({ label: `${item.supplies?.name} (${item.id})`, value: item.id.toString() }))}
          />
      </Surface>

      {!nfcData && <Text style={{ marginTop: 20, color: 'red' }}>Please enter item info to write to the NFC tag.</Text>}

      {/* Button to write the data to the NFC tag */}
      <Button
        mode="contained"
        onPress={confirmWrite}
        disabled={writing || !nfcData}
        style={{
          marginTop: 20,
          paddingVertical: 10,
          width: '80%',
        }}
        >
        Write NFC Tag
      </Button>

      {/* Modal for editing data */}
      <Modal visible={visible} onDismiss={toggleModal} contentContainerStyle={{ padding: 20, margin: 20, borderRadius: 10 }}>
        <Surface style={{ padding: 20, borderRadius: 10, gap: 10 }}>
          {/* Pass nfcData to the Create component for editing */}
          <Create toggleModal={toggleModal} setId={setNfcData} />
        </Surface>
      </Modal>
    </Surface>
  );
};

export default Writer;
