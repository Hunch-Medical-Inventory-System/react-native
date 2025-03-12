import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TextInput, Animated, Easing } from 'react-native';
import { Button, Text, Chip, Card } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import { retrieveInventory } from '@/store/tables/inventorySlice';
import type { RootState, AppDispatch } from '@/store';
import type { EntityState, ExpirableEntityState, InventoryData, SuppliesData } from '@/types/tables';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css'; // Import CSS for web

const Expired = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const inventoryData: ExpirableEntityState<InventoryData> = useSelector((state: RootState) => state.inventory);
  const suppliesData: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies);

  const [selectedItem, setSelectedItem] = useState<InventoryData | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [demoInventory, setDemoInventory] = useState<InventoryData[]>([]); // Local state for demo
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for modal

  useEffect(() => {
    // Fetch inventory data from the database
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: '' }));
  }, [dispatch]);

  useEffect(() => {
    // Initialize demo inventory with fetched data
    if (inventoryData.expired?.data) {
      setDemoInventory([...inventoryData.expired.data]);
    }
  }, [inventoryData.expired?.data]); // Update demoInventory when inventoryData changes

  const handleEdit = (item: InventoryData) => {
    setSelectedItem(item);
    setQuantity(item.quantity.toString());
    setExpiryDate(item.expiry_date ? new Date(item.expiry_date) : new Date());
    setEditModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handleDelete = (itemId: number) => {
    // Demo delete functionality
    setDemoInventory((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSave = () => {
    if (selectedItem) {
      // Demo update functionality
      setDemoInventory((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                quantity: parseInt(quantity, 10),
                expiry_date: expiryDate.toISOString().split('T')[0],
              }
            : item
        )
      );
      setEditModalVisible(false);
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
          <Button mode="text" textColor="#E94560" onPress={() => { setSelectedItem(item); setViewModalVisible(true); }}>View</Button>
          <Button mode="text" textColor="#E94560" onPress={() => handleEdit(item)}>Edit</Button>
          <Button mode="text" textColor="#E94560" onPress={() => handleDelete(item.id)}>Delete</Button>
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

  if (!demoInventory.length) {
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
          {demoInventory.map((item) => renderRow(item))}
        </View>
      </View>

      {/* View Modal */}
      <Modal
        visible={viewModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>View Item</Text>
            <Text style={styles.modalText}>Name: {selectedItem?.supply_id}</Text>
            <Text style={styles.modalText}>Quantity: {selectedItem?.quantity}</Text>
            <Text style={styles.modalText}>
              Expiry Date: {selectedItem?.expiry_date ? new Date(selectedItem.expiry_date).toLocaleDateString() : 'N/A'}
            </Text>
            <Button mode="contained" buttonColor="#E94560" onPress={() => setViewModalVisible(false)}>Close</Button>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>Edit Item</Text>

            {/* Quantity Input */}
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
              placeholder="Enter quantity"
              placeholderTextColor="#A0A0B0"
            />

            {/* Expiry Date Input */}
            <Text style={styles.label}>Expiry Date</Text>
            <DateTimePicker
              onChange={(value) => {
                if (value) {
                  setExpiryDate(value); // Only update if value is not null
                }
              }}
              value={expiryDate}
              format="yyyy-MM-dd"
              clearIcon={null} // Hide the clear icon
              calendarIcon={null} // Hide the calendar icon
              className="custom-date-picker" // Add custom styles for web
            />

            <View style={styles.modalButtons}>
              <Button mode="text" textColor="#A0A0B0" onPress={() => setEditModalVisible(false)}>Cancel</Button>
              <Button mode="contained" buttonColor="#E94560" onPress={handleSave}>Save</Button>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E94560',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#A0A0B0',
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
});

export default Expired;