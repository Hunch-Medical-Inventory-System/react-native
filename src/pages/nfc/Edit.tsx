import React, { useState, useEffect } from 'react';
import { View, Platform, useColorScheme } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-paper-dropdown';
import { updateInventory, fetchInventoryData } from '@/store/tables/inventorySlice';
import { useAppDispatch, useAppSelector } from '@/store/';
import type { InventoryData, SuppliesData, EntityState } from '@/types/tables';
import { retrieveSupplies } from '@/store/tables/suppliesSlice';

type Props = {
  toggleModal: () => void;
  currentId: number; // ID of the inventory item
};

const EditData = ({ toggleModal, currentId }: Props) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<InventoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const inventoryData: InventoryData | undefined = useAppSelector((state) =>
    state.inventory.current.data.find((item: InventoryData) => item.id === currentId)
  );

  const supplies: EntityState<SuppliesData> = useAppSelector((state) => state.supplies);

  useEffect(() => {
    if (!inventoryData) {
      dispatch(fetchInventoryData(currentId))
        .unwrap()
        .then((fetchedData) => setFormData(fetchedData))
        .catch((err) => setError('Error fetching inventory: ' + err));
    } else {
      setFormData(inventoryData);
    }
  }, [currentId, inventoryData, dispatch]);

  useEffect(() => {
    dispatch(retrieveSupplies({ itemsPerPage: 100, page: 1, keywords: '' }));
  }, [dispatch]);

  const supplyOptions = supplies.current?.data
    ? supplies.current.data.map((item: SuppliesData) => ({
        label: item.name,
        value: item.id.toString(),
      }))
    : [];

  const handleTextChange = (field: keyof InventoryData, value: string | number) => {
    if (!formData) return;
    setFormData((prevData) => ({
      ...prevData!,
      [field]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFormData((prevData) => ({
        ...prevData!,
        expiry_date: selectedDate.toISOString(),
      }));
    }
    setDatePickerVisibility(false);
  };

  const handleSave = () => {
    if (!formData) {
      console.error("Error: No formData available to update.");
      return;
    }

    if (!formData.supply_id || !formData.quantity || !formData.expiry_date) {
      setError("Please fill in all fields.");
      return;
    }

    if (!formData.id) {
      setError("Error: Inventory ID is missing.");
      return;
    }

    dispatch(updateInventory({ id: formData.id, data: formData }))
      .unwrap()
      .then(() => {
        console.log("Update successful!");
        toggleModal();
      })
      .catch((err) => {
        console.error("Error updating inventory:", err);
        setError('Error updating inventory: ' + err);
      });
  };


  return (
    <View style={{ padding: 20, gap: 10 }}>
      {error && <Button mode="contained" color="red">{error}</Button>}
      {formData ? (
        <>
          {/* Supply Dropdown */}
          <Dropdown
            label="Supply"
            placeholder="Select Supply"
            options={supplyOptions}
            value={formData.supply_id?.toString() || ''}
            onSelect={(value) => handleTextChange('supply_id', Number(value))}
          />

          {/* Quantity */}
          <TextInput
            label="Quantity"
            mode="outlined"
            keyboardType="numeric"
            value={(formData.quantity ?? '').toString()}
            onChangeText={(value) => handleTextChange('quantity', Number(value))}
          />

          {/* Expiry Date Picker */}
          <Button mode="contained" onPress={() => setDatePickerVisibility(true)} buttonColor={formData.expiry_date ? 'lightblue' : 'darkred'}>
            {formData.expiry_date ? `Expiry Date: ${new Date(formData.expiry_date).toLocaleDateString()}` : 'Select Expiry Date'}
          </Button>

          {isDatePickerVisible && (
            <DateTimePicker
              value={formData.expiry_date ? new Date(formData.expiry_date) : new Date()}
              mode="date"
              display={Platform.OS === 'android' && isDarkMode ? 'spinner' : 'calendar'}
              onChange={handleDateChange}
            />
          )}

          {/* Save Changes */}
          <Button mode="contained" onPress={handleSave} disabled={!formData}>
            Save Changes
          </Button>
        </>
      ) : (
        <Button mode="contained" loading>
          Loading...
        </Button>
      )}
    </View>
  );
};

export default EditData;
