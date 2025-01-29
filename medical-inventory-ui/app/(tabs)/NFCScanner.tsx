import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

// Initialize NFC
NfcManager.start();

const NFCScanner = () => {
  const [hasNfc, setHasNfc] = useState<Boolean | null>(null);

  useEffect(() => {
    // Check if the device supports NFC
    NfcManager.isSupported()
      .then(supported => {
        console.log(supported)
        setHasNfc(supported)
      })
      .catch(() => setHasNfc(false));
  }, []);

  const readNfc = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      Alert.alert("NFC Tag Detected", JSON.stringify(tag));
    } catch (error) {
      Alert.alert("Error", "Failed to read NFC tag");
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{hasNfc === null ? "Checking NFC..." : hasNfc ? "NFC Supported ✅" : "NFC Not Supported ❌"}</Text>
      {hasNfc && <Button title="Scan NFC Tag" onPress={readNfc} />}
    </View>
  );
};

export default NFCScanner;
