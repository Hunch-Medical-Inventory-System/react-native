import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Text, DataTable, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveSupplies } from '@/store/tables/suppliesSlice';
import type { RootState, AppDispatch } from '@/store';
import type { SuppliesData, EntityState } from '@/types/tables';

let searchTimeout: NodeJS.Timeout;

const SuppliesTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const data: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(retrieveSupplies({ keywords: search, page, itemsPerPage }));
  }, [dispatch, search, page, itemsPerPage]);

  // Debounced Search
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      setSearch(searchInput);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(searchTimeout);
  }, [searchInput]);

  if (data.loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00E6FF" />
        <Text style={styles.loadingText}>Loading Supplies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search supplies..."
          placeholderTextColor="#8FA3BF"
          value={searchInput}
          onChangeText={setSearchInput}
        />
      </View>

      {/* Data Table */}
      <DataTable style={styles.table}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title textStyle={styles.headerText}>ID</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Type</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Name</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Strength</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Route</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Qty</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Location</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText}>Created</DataTable.Title>
        </DataTable.Header>

        {data.current.data.map((item) => (
          <DataTable.Row key={item.id} style={styles.tableRow}>
            <DataTable.Cell textStyle={styles.cellText}>{item.id}</DataTable.Cell>
            <DataTable.Cell textStyle={styles.cellText}>{item.type}</DataTable.Cell>
            <DataTable.Cell textStyle={styles.cellText}>{item.name}</DataTable.Cell>
            <DataTable.Cell textStyle={styles.cellText}>{item.strength_or_volume}</DataTable.Cell>
            <DataTable.Cell textStyle={styles.cellText}>{item.route_of_use}</DataTable.Cell>
            <DataTable.Cell textStyle={styles.cellText}>{item.quantity_in_pack}</DataTable.Cell>
            <DataTable.Cell textStyle={styles.cellText}>{item.location}</DataTable.Cell>
            <DataTable.Cell textStyle={styles.cellText}>{new Date(item.created_at).toLocaleDateString()}</DataTable.Cell>
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
    backgroundColor: '#0A0A1A',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#E94560',
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    elevation: 5,
  },
  searchInput: {
    fontSize: 14,
    color: '#ffffff',
    paddingHorizontal: 12,
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#E94560',
  },
  table: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#12122A',
    elevation: 3,
  },
  tableHeader: {
    backgroundColor: '#1E1E40',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#E94560',
  },
  tableRow: {
    backgroundColor: '#171735',
    borderBottomWidth: 1,
    borderBottomColor: '#29294F',
    paddingVertical: 12,
  },
  headerText: {
    color: '#E94560',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cellText: {
    color: '#E6E6FA',
    fontSize: 12,
  },
});

export default SuppliesTable;
