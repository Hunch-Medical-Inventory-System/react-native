import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Appbar, TextInput, ActivityIndicator, Card, Title, Paragraph } from 'react-native-paper';
import { supabase } from '@/app/utils/supabaseClient';

interface InventoryItem {
  id: number;
  supply_id: string;
  created_at: string;
  expiry_date: string;
  crew_member: string;
  is_deleted: boolean;
}

const InventoryProfile = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [serverItems, setServerItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const getExpiryClass = (expDate: string) => {
    const today = new Date();
    const expiry = new Date(expDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { borderColor: '#FF6B6B' }; // Expired
    if (diffDays <= 7) return { borderColor: '#FFD93D' }; // About to expire
    if (diffDays <= 30) return { borderColor: '#6BCB77' }; // Expiring soon
    return { borderColor: '#ffffff' }; // Normal
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('inventory').select('*').range(0, itemsPerPage - 1);

      if (error) {
        console.error('Error fetching data:', error);
        setServerItems([]);
      } else {
        setServerItems(data as InventoryItem[]);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, [search, itemsPerPage]);

  const renderRow = ({ item }: { item: InventoryItem }) => {
    const expiryStyle = getExpiryClass(item.expiry_date);

    return (
      <Card style={[styles.card, expiryStyle]}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.cardTitle}>Supply ID: {item.supply_id}</Title>
          <Paragraph style={styles.cardText}>Added: {new Date(item.created_at).toLocaleDateString()}</Paragraph>
          <Paragraph style={styles.cardText}>Expiry: {new Date(item.expiry_date).toLocaleDateString()}</Paragraph>
          <Paragraph style={styles.cardText}>Crew: {item.crew_member}</Paragraph>
          <Paragraph style={styles.cardText}>Status: {item.is_deleted ? 'Deleted' : 'Active'}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.background}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="Inventory Profile" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="refresh" onPress={loadItems} />
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

        {loading ? (
          <ActivityIndicator animating={true} size="large" style={styles.loader} />
        ) : (
          <FlatList
            data={serverItems}
            renderItem={renderRow}
            keyExtractor={(item) => item.id.toString()}
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
});

export default InventoryProfile;
