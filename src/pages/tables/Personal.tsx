import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Appbar, TextInput, ActivityIndicator, Card, Title, Paragraph } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import { retrieveInventory } from '@/store/tables/inventorySlice';
import { retrieveSupplies } from '@/store/tables/suppliesSlice';
import type { RootState, AppDispatch } from '@/store';
import type { InventoryData, SuppliesData, EntityState, ExpirableEntityState } from '@/types/tables';

const InventoryProfile = () => {

  const dispatch: AppDispatch = useAppDispatch();
  const inventory: ExpirableEntityState<InventoryData> = useSelector((state: RootState) => state.inventory);
  const supplies: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const loadInventory = () => {
    dispatch(retrieveInventory({ itemsPerPage, page, keywords: search }));
  };

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: '' }));
    dispatch(retrieveSupplies({ itemsPerPage: 100, page: 1, keywords: '' }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage, page, keywords: search }));
  }, [itemsPerPage, page, search]);

  const renderRow = ({ item }: { item: InventoryData }) => {

    return (
      <Card style={[styles.card]}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.cardTitle}>{supplies.current.data.find((supply) => supply.id === item.supply_id)?.name}</Title>
          <Paragraph style={styles.cardText}>Quantity: {item.quantity}</Paragraph>
          <Paragraph style={styles.cardText}>Added: {new Date(item.created_at).toLocaleDateString()}</Paragraph>
          <Paragraph style={styles.cardText}>Expiry: {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.background}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="Inventory Profile" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="refresh" onPress={loadInventory} />
      </Appbar.Header>

      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label="Search inventory"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholder="Search by supply ID or crew member"
        />

        {inventory.loading ? (
          <ActivityIndicator animating={true} size="large" style={styles.loader} />
        ) : (
          <FlatList
            data={inventory.personal.data}
            renderItem={renderRow}
            keyExtractor={(item) => item.id!.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#181818',
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
    backgroundColor: '#181818',
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: '#181818',
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
    borderColor: '#E94560',
    backgroundColor: '#181818',
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
});

export default InventoryProfile;
