import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';


const NFCScanner = () => {
  
  const [hasNfc, setHasNFC ] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported: boolean = await NfcManager.isSupported()

      setHasNFC(deviceIsSupported)
      if (deviceIsSupported) {
        await NfcManager.start()
      }
    }

    checkIsSupported()
  }, [])

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (_tag: any) => {
      console.log('tag found')
    })

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }
  }, [])


  const readTag = async () => {
    await NfcManager.registerTagEvent();
  }
  
  return (
    <View>
      <Text>NFCScanner</Text>
    </View>
  )
}

export default NFCScanner