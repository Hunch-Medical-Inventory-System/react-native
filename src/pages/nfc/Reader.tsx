import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Modal, Button, Text, Surface } from 'react-native-paper';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import Edit from '@/components/inventory/Edit';
import Increment from '@/components/inventory/Increment';

// Initialize NFC
NfcManager.start();

const Reader = () => {
  const [id, setId] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [isIncrementOpen, setIsIncrementOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNfcSupported, setIsNfcSupported] = useState(false);

  const toggleIncrement = () => setIsIncrementOpen((oldValue) => !oldValue);
  const toggleEdit = () => setIsEditOpen((oldValue) => !oldValue);

  // Check if NFC is supported
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

  useEffect(() => {

    if (isNfcSupported) {
      readNfcTag();
    }

  }, [isNfcSupported]);

  const readNfcTag = async () => {
    if (!isNfcSupported) {
      setError('This device does not support NFC.');
      Alert.alert('NFC Not Supported', 'This device does not support NFC.');
      return;
    }

    try {
      setScanning(true);
      setError(null); // Reset error before scanning
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      // Extract number from NFC tag's data
      if (tag?.ndefMessage) {
        const tagData = tag.ndefMessage[0].payload; // Get payload from the first record
        const idFromTag = parseInt(Ndef.text.decodePayload(new Uint8Array(tagData)), 10); // Decode and parse as a number

        if (!isNaN(idFromTag)) {
          setId(idFromTag); // Set the ID from the NFC tag
          setIsIncrementOpen(true);
        } else {
          throw new Error('Invalid tag data');
        }
      } else {
        throw new Error('No readable data found on NFC tag');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read NFC tag.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setScanning(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  if (!isNfcSupported) {
    return (
      <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text variant="headlineMedium">NFC Not Supported</Text>
        <Text style={{ marginTop: 10 }}>{error || 'This device does not support NFC functionality.'}</Text>
      </Surface>
    );
  }

  return (
    <Surface style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      {/* make big text that says scan tag */}
      <Text variant="headlineMedium">NFC Scanner</Text>
      {scanning && <Text>Scanning...</Text>}

      <Button mode="contained" onPress={readNfcTag} disabled={scanning}>
        Scan Another NFC Tag
      </Button>

      {error && <Text style={{ marginTop: 20, color: 'red' }}>{error}</Text>}

      <Button mode="contained" onPress={toggleEdit} disabled={!id}>
        Change Last Item Details
      </Button>
      <Modal visible={isIncrementOpen} onDismiss={toggleIncrement} contentContainerStyle={{ padding: 20, margin: 20, borderRadius: 10 }}>
        <Surface style={{ padding: 20, borderRadius: 10, gap: 10 }}>
          <Increment toggleModal={toggleIncrement} currentId={id} />
          <Button onPress={toggleIncrement}>Close</Button>
        </Surface>
      </Modal>
      <Modal visible={isEditOpen} onDismiss={toggleEdit} contentContainerStyle={{ padding: 20, margin: 20, borderRadius: 10 }}>
        <Surface style={{ padding: 20, borderRadius: 10, gap: 10 }}>
          <Edit toggleModal={toggleEdit} currentId={id} />
          <Button onPress={toggleEdit}>Close</Button>
        </Surface>
      </Modal>
    </Surface>
  );
};

export default Reader;