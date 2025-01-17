import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { DataTable, TextInput, ActivityIndicator, Title, Button } from 'react-native-paper';
import { supabase } from '/workspaces/react-native/medical-inventory-ui/app/utils/supabaseClient';
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
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [background, setBackground] = useState(require('/workspaces/react-native/medical-inventory-ui/assets/images/background.png'));

  const getExpiryClass = (expDate: string) => {
    const today = new Date();
    const expiry = new Date(expDate);
    const diffTime = expiry.getTime() - today.getTime(); 
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return styles.expired;
    } else if (diffDays <= 7) {
      return styles.aboutToExpire;
    } else if (diffDays <= 30) {
      return styles.expiringSoon;
    }
    return null;
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('inventory')
        .select('*', { count: 'exact' }) 
        .range(0, itemsPerPage - 1);
  
      if (error) {
        console.error('Error fetching data:', error);
        setServerItems([]);
        setTotalItems(0);
      } else {
        console.log('Fetched data:', data); 
        setServerItems(data as InventoryItem[]);
        setTotalItems(count || 0);
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
    const expiryStyle = getExpiryClass(item.expiry_date); // Get the background style
    const isExpiring = expiryStyle === styles.expired || expiryStyle === styles.aboutToExpire || expiryStyle === styles.expiringSoon; // Check if it matches expiring styles
  
    return (
      <DataTable.Row style={[styles.dataTableRow, expiryStyle]}>
        <DataTable.Cell textStyle={isExpiring ? styles.rowTextWhite : styles.dataTableRowText}>
          {item.id}
        </DataTable.Cell>
        <DataTable.Cell textStyle={isExpiring ? styles.rowTextWhite : styles.dataTableRowText}>
          {new Date(item.created_at).toLocaleDateString()}
        </DataTable.Cell>
        <DataTable.Cell textStyle={isExpiring ? styles.rowTextWhite : styles.dataTableRowText}>
          {item.is_deleted ? 'Yes' : 'No'}
        </DataTable.Cell>
        <DataTable.Cell textStyle={isExpiring ? styles.rowTextWhite : styles.dataTableRowText}>
          {item.supply_id}
        </DataTable.Cell>
        <DataTable.Cell textStyle={isExpiring ? styles.rowTextWhite : styles.dataTableRowText}>
          {new Date(item.expiry_date).toLocaleDateString()}
        </DataTable.Cell>
        <DataTable.Cell textStyle={isExpiring ? styles.rowTextWhite : styles.dataTableRowText}>
          {item.crew_member}
        </DataTable.Cell>
      </DataTable.Row>
    );
  };
  

  const changeBackground = (newBackground: string) => {
    setBackground({ uri: newBackground });
  };

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Title style={styles.title}>Inventory Profile</Title>

        <TextInput
          mode="outlined"
          label="Search inventory"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {loading ? (
          <ActivityIndicator animating={true} size="large" style={styles.loader} />
        ) : (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>ID</DataTable.Title>
              <DataTable.Title>Created At</DataTable.Title>
              <DataTable.Title>Is Deleted</DataTable.Title>
              <DataTable.Title>Supply ID</DataTable.Title>
              <DataTable.Title>Expiry Date</DataTable.Title>
              <DataTable.Title>Crew Member</DataTable.Title>
            </DataTable.Header>

            <FlatList
              data={serverItems}
              renderItem={renderRow}
              keyExtractor={(item) => item.id.toString()}
            />
          </DataTable>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.0)', 
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#ffffff', 
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  rowTextWhite: {
    color: '#FFFFFF', // White text
    fontWeight: 'bold', // Optional: Make it bold for better visibility
  },
  searchInput: {
    marginBottom: 16,
    backgroundColor: '#1F1F1F', 
    borderRadius: 8,
    padding: 8,
    color: '#FFFFFF', 
  },
  loader: {
    marginTop: 20,
    color: '#ffffff',
  },
  expired: {
    backgroundColor: '#f40505', 
    borderRadius: 8,
    padding: 8,
  },
  aboutToExpire: {
    backgroundColor: '#f48405', 
    borderRadius: 8,
    padding: 8,
  },
  expiringSoon: {
    backgroundColor: '#f0c217', 
    borderRadius: 8,
    padding: 8,
  },
  dataTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000000', // Subtle shadow for elevation
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    
  },
  dataTableHeader: {
    backgroundColor: '#F2F2F2',
  },
  dataTableHeaderText: {
    fontWeight: 'bold',
    color: '#333333', 
  },
  dataTableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', 
    backgroundColor: '#FFFFFF', 
  },
  dataTableRowText: {
    color: '#333333', 
  },
});

export default InventoryProfile;
