import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Chip, Surface, Card, DataTable } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveInventory } from '@/app/store/tables/inventorySlice';
import type { RootState, AppDispatch } from '@/app/store';
import type { EntityState, InventoryData, SuppliesData } from '@/app/utils/types';

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
        <Card.Title title={suppliesData.loading ? 'Loading...' : supply?.item || 'Unknown Supply'} />
        <Card.Content>
          <Text>Quantity: {item.quantity}</Text>
          <Text>
            Expiry Date: <Chip>{new Date(item.expiry_date).toLocaleDateString()}</Chip>
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button>View</Button>
          <Button>Edit</Button>
        </Card.Actions>
      </Card>
    );
  };

  if (inventoryData.loading || suppliesData.loading) {
    return (
      <ImageBackground
        source={require('@/assets/images/background.png')}
        style={styles.background}
      >
        <View style={styles.centeredView}>
          <Text>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (!inventoryData.expired?.data?.length) {
    return (
      <ImageBackground
        source={require('@/assets/images/background.png')}
        style={styles.background}
      >
        <View style={styles.centeredView}>
          <Text>No Data</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={styles.background}
    >
      <ScrollView>
        <Surface style={styles.container}>
          <Text variant="displayLarge">Expired Inventory</Text>
          <View style={styles.cardContainer}>
            {inventoryData.expired.data.map((item) => renderRow(item))}
          </View>
        </Surface>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    margin: 20,
    padding: 10,
    flexGrow: 1,
  },
});

export default Expired;
