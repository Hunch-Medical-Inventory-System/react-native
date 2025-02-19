import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Appbar, TextInput, ActivityIndicator, Card, Title, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveInventory } from '@/store/tables/inventorySlice';
import type { RootState, AppDispatch } from '@/store';
import type { InventoryData, EntityState } from '@/types/tables';

const InventoryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { current, loading, error }: EntityState<InventoryData> = useSelector(
    (state: RootState) => state.inventory
  );
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [search]);

  const fetchInventory = () => {
    dispatch(
      retrieveInventory({
        itemsPerPage: 10,
        page: 1,
        keywords: search,
      })
    ).catch((err) => console.error('Error fetching inventory:', err));
  };

  const getExpiryClass = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysToExpiry <= 0) return { borderColor: '#E94560' }; // Expired
    if (daysToExpiry <= 3) return { borderColor: '#F5A623' }; // Warning
    return { borderColor: '#0F3450' }; // Success
  };

  const renderRow = ({ item }: { item: InventoryData }) => {
    const expiryStyle = getExpiryClass(item.expiry_date);
    return (
      <Card style={[styles.card, expiryStyle]}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.cardTitle}>Supply ID: {item.supply_id}</Title>
          <Paragraph style={styles.cardText}>Quantity: {item.quantity}</Paragraph>
          <Paragraph style={styles.cardText}>
            Expiry: {new Date(item.expiry_date).toLocaleDateString()}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.background}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="Inventory Table" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="refresh" onPress={fetchInventory} />
      </Appbar.Header>

      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label="Search inventory"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholder="Search by supply ID or card ID"
          placeholderTextColor="#A0A0B0"
          theme={{ colors: { text: '#ffffff', primary: '#E94560' } }}
        />

        {loading ? (
          <ActivityIndicator animating={true} size="large" style={styles.loader} color="#E94560" />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading inventory: {error}</Text>
          </View>
        ) : current?.data && current.data.length > 0 ? (
          <FlatList
            data={current.data}
            renderItem={renderRow}
            keyExtractor={(item) => (item.id ?? '').toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#1A1A2E',
    elevation: 0,
  },
  appBarTitle: {
    color: '#E94560',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  background: {
    flex: 1,
    backgroundColor: '#0F0F1F',
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    fontSize: 14,
    color: '#ffffff',
  },
  loader: {
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    borderWidth: 1.5,
    backgroundColor: '#1A1A2E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 8,
    flexShrink: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#F0F0F0',
  },
  cardText: {
    fontSize: 12,
    color: '#A0A0B0',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#E94560',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#A0A0B0',
  },
});

export default InventoryTable;
