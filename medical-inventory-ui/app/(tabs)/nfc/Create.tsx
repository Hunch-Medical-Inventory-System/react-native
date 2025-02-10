import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { addInventory } from '@/app/store/tables/inventorySlice'; // Assuming the thunk is in the "thunks" file.
import { useAppDispatch } from '@/app/store/';
import type { InventoryData } from '@/app/types/tables';

const Data = ({
  setVisible, // Function passed as a prop to update modal visibility
  setId, // Function passed as a prop to set the id after saving
}: {
  setVisible: (visible: boolean) => void;
  setId: (id: number) => void;
}) => {
  // Initialize the state for all fields in one object
  const [formData, setFormData] = useState<InventoryData>({
    supply_id: 0,
    quantity: 0,
    expiry_date: '',
  });

  const dispatch = useAppDispatch();

  // Handler to update form data dynamically
  const handleTextChange = (field: keyof InventoryData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Array of field configurations
  const fields = [
    { label: 'Supply ID', key: 'supply_id', isNumeric: true },
    { label: 'Quantity', key: 'quantity', isNumeric: true },
    { label: 'Expiry Date', key: 'expiry_date', isNumeric: false },
  ];

  const handleSave = () => {
    // Dispatch the Redux action to add the new inventory item
    dispatch(addInventory(formData)).unwrap()
      .then((id: number) => {
        console.log('Inventory added with id:', id);
        // Call setId to update the id in the parent component
        setId(id);
        // Close the modal after successful save
        setVisible(false);
      })
      .catch((error: any) => {
        console.error('Error adding inventory:', error);
      });
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      {fields.map(({ label, key, isNumeric }) => (
        <TextInput
          key={key}
          label={label}
          mode="outlined"
          keyboardType={isNumeric ? 'numeric' : 'default'}
          value={(formData[key as keyof InventoryData] ?? '').toString()}
          onChangeText={(value) => handleTextChange(key as keyof InventoryData, value)}
        />
      ))}

      {/* Save Button */}
      <Button mode="contained" onPress={handleSave}>
        Save
      </Button>
    </View>
  );
};

export default Data;
