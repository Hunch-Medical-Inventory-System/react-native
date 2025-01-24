import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DataTable, Chip, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveInventory } from '@/app/store/tables/inventorySlice';
import type { RootState, AppDispatch } from '@/app/store';
import type { InventoryData, EntityState } from '@/app/utils/types';

const InventoryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { current, loading }: EntityState<InventoryData> = useSelector(
    (state: RootState) => state.inventory
  );

  useEffect(() => {
    dispatch(
      retrieveInventory({
        itemsPerPage: 10,
        page: 1,
        keywords: '',
      })
    );
  }, [dispatch]);

  const getChipStyle = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysToExpiry <= 0) return styles.expiredChip;
    if (daysToExpiry <= 3) return styles.warningChip;
    return styles.successChip;
  };

  const renderRow = (item: InventoryData) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.card_id}</DataTable.Cell>
      <DataTable.Cell>{item.supply_id}</DataTable.Cell>
      <DataTable.Cell>{item.quantity}</DataTable.Cell>
      <DataTable.Cell>
        <Chip style={getChipStyle(item.expiry_date)} textStyle={styles.chipText}>
          {new Date(item.expiry_date).toLocaleDateString()}
        </Chip>
      </DataTable.Cell>
    </DataTable.Row>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  if (!current?.data || current.data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available</Text>
        <Button mode="contained" onPress={() => dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: '' }))}>
          Refresh
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Id</DataTable.Title>
          <DataTable.Title>Card Id</DataTable.Title>
          <DataTable.Title>Supply Id</DataTable.Title>
          <DataTable.Title>Quantity</DataTable.Title>
          <DataTable.Title>Expiry Date</DataTable.Title>
        </DataTable.Header>
        {current.data.map(renderRow)}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  expiredChip: {
    backgroundColor: '#ffcccc',
  },
  warningChip: {
    backgroundColor: '#fff4cc',
  },
  successChip: {
    backgroundColor: '#ccffcc',
  },
  chipText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default InventoryTable;
