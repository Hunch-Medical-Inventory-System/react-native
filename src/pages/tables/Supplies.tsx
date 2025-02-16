import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Text, DataTable, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveSupplies } from '@/store/tables/suppliesSlice';
import type { RootState, AppDispatch } from '@/store';
import type { SuppliesData, EntityState } from '@/types/tables';

const SuppliesTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const data: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies);

  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<SuppliesData>({
    id: 0,
    type: '',
    item: '',
    strength_or_volume: '',
    route_of_use: '',
    quantity_in_pack: 0,
    possible_side_effects: '',
    location: '',
    is_deleted: false,
    created_at: new Date().toISOString(),
  });

  useEffect(() => {
    dispatch(retrieveSupplies({ keywords: search, page, itemsPerPage }));
  }, [dispatch, search, page, itemsPerPage]);

  if (data.loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search supplies..."
          placeholderTextColor="#A0A0B0"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title textStyle={styles.headerText}>Id</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Type</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Item</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Strength</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Route</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Quantity</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Location</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Created</DataTable.Title>
        </DataTable.Header>
        {data.current.data.map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.id}</DataTable.Cell>
            <DataTable.Cell>{item.type}</DataTable.Cell>
            <DataTable.Cell>{item.item}</DataTable.Cell>
            <DataTable.Cell>{item.strength_or_volume}</DataTable.Cell>
            <DataTable.Cell>{item.route_of_use}</DataTable.Cell>
            <DataTable.Cell>{item.quantity_in_pack}</DataTable.Cell>
            <DataTable.Cell>{item.location}</DataTable.Cell>
            <DataTable.Cell>{new Date(item.created_at).toLocaleDateString()}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0F0F1F',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    fontSize: 14,
    color: '#ffffff',
    paddingHorizontal: 8,
    height: 40,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SuppliesTable;
