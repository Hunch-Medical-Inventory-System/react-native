import React, { useEffect, useState } from 'react';
import { View, Platform, useColorScheme } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-paper-dropdown';
import { useSelector } from 'react-redux';
import { addInventory } from '@/store/tables/inventorySlice';
import { useAppDispatch } from '@/store';
import type { AppDispatch, RootState } from '@/store';
import type { SuppliesData, InventoryData, EntityState } from '@/types/tables';
import { retrieveSupplies } from '@/store/tables/suppliesSlice';

type CreateProps = {
  toggleModal: () => void;
  setId: (id: number) => void;
};

const Create = ({ toggleModal, setId }: CreateProps) => {
  const [formData, setFormData] = useState<Partial<InventoryData>>({
    supply_id: 0,
    quantity: 0,
    expiry_date: '',
  });

  const supplies: EntityState<SuppliesData> = useSelector(
    (state: RootState) => state.supplies
  );

  const supplyValue = formData.supply_id ? formData.supply_id.toString() : '';

  const supplyOptions = supplies.active?.data
    ? supplies.active.data.map((item: SuppliesData) => ({
        label: item.name,
        value: item.id.toString(),
      }))
    : [];

  const dispatch: AppDispatch = useAppDispatch();

  const fetchSupplies = () => {
    dispatch(
      retrieveSupplies({
        itemsPerPage: 10,
        page: 1,
        keywords: '',
      })
    ).catch((err) => console.error('Error fetching inventory:', err));
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const toggleDatePicker = () => {
    setDatePickerVisibility((oldValue) => !oldValue);
  };

  const handleTextChange = (field: keyof Partial<InventoryData>, value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFormData((prevData) => ({
        ...prevData,
        expiry_date: selectedDate.toISOString(),
      }));
    }
    setDatePickerVisibility(false);
  };

  const handleSave = () => {
    if (!formData.supply_id || !formData.quantity || !formData.expiry_date) {
      alert('Please fill in all fields.');
      return;
    }

    dispatch(addInventory(formData))
      .unwrap()
      .then((id: number) => {
        setId(id);
        toggleModal();
      })
      .catch((error: any) => {
        console.error('Error adding inventory:', error);
      });
  };

  const handleCancel = () => {
    toggleModal();
    setFormData({
      supply_id: 0,
      quantity: 0,
      expiry_date: '',
    });
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  return (
    <View style={{ padding: 20, gap: 10 }}>
      {/* Supply ID Dropdown */}
      <Dropdown
        label="Supply"
        placeholder="Select Supply"
        options={supplyOptions}
        value={supplyValue} // Always a string
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

      {/* Date Picker Button */}
      <Button mode="contained" onPress={toggleDatePicker} buttonColor={formData.expiry_date ? 'lightblue' : 'red'}>
        {formData.expiry_date ? `Expiry Date: ${new Date(formData.expiry_date).toLocaleDateString()}` : 'Select Expiry Date'}
      </Button>

      {/* Date Picker (Opens on button press) */}
      {isDatePickerVisible && (
        <DateTimePicker
          value={formData.expiry_date ? new Date(formData.expiry_date) : new Date()}
          mode="date"
          display={Platform.OS === 'android' && isDarkMode ? 'spinner' : 'calendar'}
          onChange={handleDateChange}
        />
      )}

      {/* Save & Cancel Buttons */}
      <Button mode="contained" onPress={handleSave} buttonColor="lightgreen">
        Save
      </Button>
      <Button mode="outlined" onPress={handleCancel}>
        Cancel
      </Button>
    </View>
  );
};

export default Create;
