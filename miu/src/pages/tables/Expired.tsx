import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Chip, Card, Surface } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveInventory } from '@/store/tables/inventorySlice';
import type { RootState, AppDispatch } from '@/store';
import type { EntityState, InventoryData, SuppliesData } from '@/types/tables';

const Expired = () => {
  const dispatch = useDispatch<AppDispatch>();
  const inventoryData: EntityState<InventoryData> = useSelector((state: RootState) => state.inventory);
  const suppliesData: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies);

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: '' }));
  }, [dispatch]);

  const renderRow = (item: InventoryData) => {
    const supply = suppliesData.current?.data.find((supply) => supply.id === item.supply_id);

    return (
      <Card style={styles.card} key={item.id}>
        <Card.Content>
          <Text style={styles.cardTitle}>{supply?.item || 'Unknown Supply'}</Text>
          <Text style={styles.cardText}>Quantity: {item.quantity}</Text>
          <Text style={styles.cardText}>
            Expiry Date: <Chip style={styles.chip}>{new Date(item.expiry_date).toLocaleDateString()}</Chip>
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button textColor="#E94560">View</Button>
          <Button textColor="#E94560">Edit</Button>
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
      <Surface style={styles.container}>
        <Text style={styles.header}>Expired Inventory</Text>
        <View style={styles.cardContainer}>
          {inventoryData.expired.data.map((item) => renderRow(item))}
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0F0F1F',
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F0F0',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F1F',
  },
  loadingText: {
    color: '#A0A0B0',
    fontSize: 18,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F1F',
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
    backgroundColor: '#1A1A2E',
    borderWidth: 1.5,
    borderColor: '#E94560',
    padding: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F0F0F0',
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
});

export default Expired;
