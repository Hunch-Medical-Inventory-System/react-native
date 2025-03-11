import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { Button, Text, Chip, Card, TextInput, Portal, Dialog } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import { retrieveInventory, updateInventory } from '@/store/tables/inventorySlice';
import type { RootState, AppDispatch } from '@/store';
import type { EntityState, ExpirableEntityState, InventoryData, SuppliesData } from '@/types/tables';

const Expired = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const inventoryData: ExpirableEntityState<InventoryData> = useSelector((state: RootState) => state.inventory);
  const suppliesData: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies);

  const [selectedItem, setSelectedItem] = useState<InventoryData | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: '' }));
  }, [dispatch]);

  const handleEdit = (item: InventoryData) => {
    setSelectedItem(item);
    setQuantity(item.quantity.toString());
    setExpiryDate(item.expiry_date || '');
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    if (selectedItem) {
      try {
        await dispatch(
          updateInventory({
            id: selectedItem.id,
            data: {
              quantity: parseInt(quantity, 10),
              expiry_date: expiryDate,
            },
          })
        ).unwrap(); // Unwrap to handle potential errors
        setEditModalVisible(false);
      } catch (error) {
        console.error('Failed to update item:', error);
        // Optionally, show an error message to the user
      }
    }
  };

  const renderRow = (item: InventoryData) => {
    const supply = suppliesData.current?.data.find((supply) => supply.id === item.supply_id);

    return (
      <Card style={styles.card} key={item.id}>
        <Card.Content>
          <Text style={styles.cardTitle}>{supply?.name || 'Unknown Supply'}</Text>
          <Text style={styles.cardText}>Quantity: {item.quantity}</Text>
          <Text style={styles.cardText}>
            Expiry Date: <Chip style={styles.chip}>{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}</Chip>
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button textColor="#E94560" onPress={() => { setSelectedItem(item); setViewModalVisible(true); }}>View</Button>
          <Button textColor="#E94560" onPress={() => handleEdit(item)}>Edit</Button>
        </Card.Actions>
      </Card>
    );
  };

  if (inventoryData.loading || suppliesData.loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!inventoryData.expired?.data?.length) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No Data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Expired Inventory</Text>
        <View style={styles.cardContainer}>
          {inventoryData.expired.data.map((item) => renderRow(item))}
        </View>
      </View>

      {/* View Modal */}
      <Portal>
        <Modal visible={viewModalVisible} onDismiss={() => setViewModalVisible(false)}>
          <Dialog visible={viewModalVisible} onDismiss={() => setViewModalVisible(false)} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>View Item</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText}>Name: {selectedItem?.supply_id}</Text>
              <Text style={styles.dialogText}>Quantity: {selectedItem?.quantity}</Text>
              <Text style={styles.dialogText}>
                Expiry Date: {selectedItem?.expiry_date ? new Date(selectedItem.expiry_date).toLocaleDateString() : 'N/A'}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#E94560" onPress={() => setViewModalVisible(false)}>Close</Button>
            </Dialog.Actions>
          </Dialog>
        </Modal>
      </Portal>

      {/* Edit Modal */}
      <Portal>
        <Modal visible={editModalVisible} onDismiss={() => setEditModalVisible(false)}>
          <Dialog visible={editModalVisible} onDismiss={() => setEditModalVisible(false)} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>Edit Item</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                style={styles.input}
                theme={{
                  colors: {
                    primary: '#E94560', // Accent color for the input
                    background: '#181818', // Background color of the input
                    text: '#FFFFFF', // Text color
                    placeholder: '#A0A0B0', // Placeholder color
                  },
                }}
              />
              <TextInput
                label="Expiry Date"
                value={expiryDate}
                onChangeText={setExpiryDate}
                style={styles.input}
                theme={{
                  colors: {
                    primary: '#E94560', // Accent color for the input
                    background: '#181818', // Background color of the input
                    text: '#FFFFFF', // Text color
                    placeholder: '#A0A0B0', // Placeholder color
                  },
                }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#A0A0B0" onPress={() => setEditModalVisible(false)}>Cancel</Button>
              <Button textColor="#E94560" onPress={handleSave}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#A0A0B0',
    fontSize: 18,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  noDataText: {
    color: '#A0A0B0',
    fontSize: 18,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5,
    borderColor: '#E94560',
    padding: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#A0A0B0',
  },
  chip: {
    backgroundColor: '#E94560',
    color: '#FFF',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#181818',
    color: '#FFFFFF',
  },
  dialog: {
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 16,
  },
  dialogTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dialogText: {
    color: '#A0A0B0',
    fontSize: 16,
  },
});

export default Expired;