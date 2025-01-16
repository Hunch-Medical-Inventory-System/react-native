import NfcManager, { NfcTech, NfcError } from "react-native-nfc-manager";

// Initialize the NFC Manager
export function initializeNfc() {
  NfcManager.start()
    .then(() => console.log("NFC Manager initialized"))
    .catch((error: any) =>
      console.error("NFC initialization failed:", error)
    );
}

// Read an NFC Tag
export async function readNfcTag() {
  try {
    // Request NFC technology
    await NfcManager.requestTechnology(NfcTech.Ndef);

    // Get the NFC tag
    const tag = await NfcManager.getTag();
    console.log("NFC Tag:", tag);

    // Clean up
    await NfcManager.cancelTechnologyRequest();
    return tag;
  } catch (error) {
    console.error("Failed to read NFC tag:", error);
    await NfcManager.cancelTechnologyRequest(); // Ensure clean-up
    throw error;
  }
}
