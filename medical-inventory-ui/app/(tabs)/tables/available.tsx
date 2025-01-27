import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Appbar, TextInput, ActivityIndicator, Card, Title, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveInventory } from '@/app/store/tables/inventorySlice';
import type { RootState, AppDispatch } from '@/app/store';
import type { InventoryData, EntityState } from '@/app/utils/types';
import { ImageBackground } from 'react-native';

const InventoryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { current, loading, error }: EntityState<InventoryData> = useSelector(
    (state: RootState) => state.inventory
  );
  const [search, setSearch] = useState('');
  const background = require('@/assets/images/background.png');

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

    if (daysToExpiry <= 0) return { backgroundColor: '#b21414' }; // Expired
    if (daysToExpiry <= 3) return { backgroundColor: '#fff4cc' }; // Warning
    return { backgroundColor: '#000000' }; // Success
  };

  const renderRow = ({ item }: { item: InventoryData }) => {
    const expiryStyle = getExpiryClass(item.expiry_date);
    return (
      <Card style={[styles.card, expiryStyle]}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.cardTitle}>Supply ID: {item.supply_id}</Title>
          <Paragraph style={styles.cardText}>Card ID: {item.card_id}</Paragraph>
          <Paragraph style={styles.cardText}>Quantity: {item.quantity}</Paragraph>
          <Paragraph style={styles.cardText}>
            Expiry: {new Date(item.expiry_date).toLocaleDateString()}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ImageBackground source={background} style={styles.background} imageStyle={styles.backgroundImage}>
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
        />

        {loading ? (
          <ActivityIndicator animating={true} size="large" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading inventory: {error}</Text>
          </View>
        ) : current?.data && current.data.length > 0 ? (
          <FlatList
            data={current.data}
            renderItem={renderRow}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#007bff',
  },
  appBarTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 8,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  backgroundImage: {
    opacity: 1,
  },
  searchInput: {
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 8,
  },
  card: {
    width: '48%',
    marginBottom: 8,
    borderRadius: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 6,
    backgroundColor: '#ffffff',
  },
  cardContent: {
    padding: 0,
    flexShrink: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 16,
  },
  cardText: {
    fontSize: 11,
    lineHeight: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    color: 'red',
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
});

export default InventoryTable;
