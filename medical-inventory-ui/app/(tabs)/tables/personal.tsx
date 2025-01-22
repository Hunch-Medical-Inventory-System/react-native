import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Appbar, TextInput, ActivityIndicator, Card, Title, Paragraph } from 'react-native-paper';
import { supabase } from '@/app/utils/supabaseClient';
import { ImageBackground } from 'react-native';

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
  const background = require('@/assets/images/background.png');

  const getExpiryClass = (expDate: string) => {
    const today = new Date();
    const expiry = new Date(expDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { backgroundColor: '#b21414' }; // Expired
    if (diffDays <= 7) return { backgroundColor: '#fff4cc' }; // About to expire
    if (diffDays <= 30) return { backgroundColor: '#e6f7cc' }; // Expiring soon
    return { backgroundColor: '#ffffff' }; // Normal
  };

  const getTextColor = (backgroundColor: string): string => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
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
    const textColor = getTextColor(expiryStyle.backgroundColor);

    return (
      <Card style={[styles.card, expiryStyle]}>
        <Card.Content style={styles.cardContent}>
          <Title
            style={[styles.cardTitle, { color: textColor }]}
            adjustsFontSizeToFit
            numberOfLines={1}>
            Supply ID: {item.supply_id}
          </Title>
          <Paragraph
            style={[styles.cardText, { color: textColor }]}
            adjustsFontSizeToFit
            numberOfLines={1}>
            Added: {new Date(item.created_at).toLocaleDateString()}
          </Paragraph>
          <Paragraph
            style={[styles.cardText, { color: textColor }]}
            adjustsFontSizeToFit
            numberOfLines={1}>
            Expiry: {new Date(item.expiry_date).toLocaleDateString()}
          </Paragraph>
          <Paragraph
            style={[styles.cardText, { color: textColor }]}
            adjustsFontSizeToFit
            numberOfLines={1}>
            Crew: {item.crew_member}
          </Paragraph>
          <Paragraph
            style={[styles.cardText, { color: textColor }]}
            adjustsFontSizeToFit
            numberOfLines={1}>
            Status: {item.is_deleted ? 'Deleted' : 'Active'}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ImageBackground source={background} style={styles.background} imageStyle={styles.background}>
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
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
            contentContainerStyle={styles.listContainer}
          />
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
    elevation: 4, // For Android shadow
    shadowColor: '#000', // Shadow for iOS
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
});


export default InventoryProfile;
