import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { fetchInventoryData, takeInventory } from '@/store/tables/inventorySlice';
import { useAppDispatch } from '@/store/';
import type { InventoryData } from '@/types/tables';

type Props = {
  toggleModal: () => void;
  currentId: number; // ID of the inventory item
};

const EditData = ({ toggleModal, currentId }: Props) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData: Partial<InventoryData>[] | undefined = await dispatch(fetchInventoryData({ ids: [currentId], columns: ["quantity","supplies(name)"] }))
          .unwrap();

        if (fetchedData && fetchedData[0] && fetchedData[0].supplies && fetchedData[0].supplies.name) {
          setName(fetchedData[0].supplies?.name as string);
        }
        
      } catch (err) {
        setError('Error fetching inventory: ' + err);
      }
    };

    fetchData();
  }, [currentId, dispatch]);

  const handleRemove = () => {
    if (!quantity || isNaN(Number(quantity))) {
      console.error("Error: No Quantity provided.");
      return;
    }

    try {
      dispatch(takeInventory({ itemId: currentId, quantityTaken: quantity })).unwrap()
    } catch (err) {
      console.error("Error updating inventory:", err);
      setError('Error updating inventory: ' + err);
    }

    // Close the modal after updating
    toggleModal();
  };


  return (
    <View style={{ padding: 20, gap: 10 }}>
      {error && <Button mode="contained" color="red">{error}</Button>}
      { name ? (
        <>
          {/* Supply Dropdown */}
          <Text>{ name } - { currentId }</Text>
          
          <Text>test</Text>

          {/* Quantity */}
          <TextInput
            label="Quantity Removed"
            mode="outlined"
            keyboardType="numeric"
            value={quantity ? quantity.toString() : ''}
            onChangeText={(value) => setQuantity(parseInt(value))}
          />

          {/* Save Changes */}
          <Button mode="contained" onPress={handleRemove} disabled={!quantity}>
            Remove { quantity ? quantity : 1 } from { name }
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