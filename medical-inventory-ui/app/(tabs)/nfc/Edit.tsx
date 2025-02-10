import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { updateInventory } from '@/app/store/tables/inventorySlice'; // Assuming the thunk is in the "thunks" file.
import { useAppDispatch } from '@/app/store/';
import type { InventoryData } from '@/app/types/tables';

const EditData = ({
  setVisible, // Function passed as a prop to update modal visibility
  setId, // Function passed as a prop to set the id after saving
  data, // The data to edit
}: {
  setVisible: (visible: boolean) => void;
  setId: (id: number) => void;
  data: InventoryData; // The data to edit
}) => {
  // Initialize the state with the passed data
  const [formData, setFormData] = useState<InventoryData>(data);

  const dispatch = useAppDispatch();

  // Handler to update form data dynamically
  const handleTextChange = (field: keyof InventoryData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Array of field configurations for form inputs
  const fields = [
    { label: 'Supply ID', key: 'supply_id', isNumeric: true },
    { label: 'Quantity', key: 'quantity', isNumeric: true },
    { label: 'Expiry Date', key: 'expiry_date', isNumeric: false },
  ];

  const handleSave = () => {
    // Dispatch the Redux action to update the inventory item
    dispatch(updateInventory({ id: formData.id ?? 0, data: formData })) // Pass both id and data for the update
      .unwrap() // This unwraps the result to get the plain result value (success or failure)
      .then(() => {
        // If successful, log the success and close the modal
        console.log('Inventory updated successfully.');
        // Call setId to update the id in the parent component if needed
        if (formData.id !== undefined) {
          setId(formData.id); // Assuming the formData contains the id to update
        }
        // Close the modal after successful save
        setVisible(false);
      })
      .catch((error: any) => {
        // Handle any error that occurs during the update
        console.error('Error updating inventory:', error);
        // Optionally, you could show a message to the user here
      });
  };


  useEffect(() => {
    // If data is updated from the parent component, update the state
    setFormData(data);
  }, [data]);

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
        Save Changes
      </Button>
    </View>
  );
};

export default EditData;
