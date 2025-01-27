<<<<<<< HEAD
import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { Text, DataTable, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveInventory } from '@/app/store/tables/inventorySlice';
import type { RootState, AppDispatch } from '@/app/store';
import type { EntityState, InventoryData } from '@/app/utils/types';

const Expired = () => {
  const dispatch = useDispatch<AppDispatch>();
  const data: EntityState<InventoryData> = useSelector((state: RootState) => state.inventory);
=======
import React, { useEffect } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Button, Text, Chip, Surface, Card } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveInventory } from '@/app/store/tables/inventorySlice'
import type { RootState, AppDispatch } from '@/app/store'
import type { EntityState, InventoryData, SuppliesData } from '@/app/utils/types'


const Expired = () => {
  
  const dispatch = useDispatch<AppDispatch>()
  const inventoryData: EntityState<InventoryData> = useSelector((state: RootState) => state.inventory)
  const suppliesData: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies)
>>>>>>> fa825382f14173beb211e793f71c175ded2b0f4b

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: '' }));
  }, []);

<<<<<<< HEAD
  console.log('test', data);

  const renderRow = (item: InventoryData) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.card_id}</DataTable.Cell>
      <DataTable.Cell>{item.supply_id}</DataTable.Cell>
      <DataTable.Cell>{item.quantity}</DataTable.Cell>
      <DataTable.Cell><Chip>{item.expiry_date}</Chip></DataTable.Cell>
    </DataTable.Row>
  );

  if (data.loading) {
=======
  console.log(suppliesData)

  const renderRow = (item: InventoryData) => (
    <Card style={styles.card} key={item.id}>
      <Card.Title title={ 
        suppliesData.loading ? 'Loading...' : suppliesData.current.data.find(supply => supply.id === item.supply_id)?.item 
      } />
      <Card.Content>
        {/* <Text>{item.id}</Text>
        <Text>{item.card_id}</Text> */}
        <Text>{item.quantity}</Text>
        <Text><Chip>{new Date(item.expiry_date).toLocaleDateString()}</Chip></Text>
      </Card.Content>
      <Card.Actions>
        <Button>View</Button>
        <Button>Edit</Button>
      </Card.Actions>
    </Card>
  )
  
  if (inventoryData.loading) {
>>>>>>> fa825382f14173beb211e793f71c175ded2b0f4b
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

  if (inventoryData.expired === undefined) {
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
<<<<<<< HEAD
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Id</DataTable.Title>
            <DataTable.Title>Card Id</DataTable.Title>
            <DataTable.Title>Supply Id</DataTable.Title>
            <DataTable.Title>Quantity</DataTable.Title>
            <DataTable.Title>Expiry Date</DataTable.Title>
          </DataTable.Header>
          {data.expired.data.map((item) => renderRow(item))}
        </DataTable>
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
    flexGrow: 1,
    padding: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Expired;
=======
    <ScrollView>
      <Surface style={styles.container}>  
        <Text variant='displayLarge' >Expired Inventory</Text>
        <View style={styles.cardContainer}>
          { inventoryData.expired.data.map((item) => renderRow(item)) }
        </View>
      </Surface>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
  }
})

export default Expired
>>>>>>> fa825382f14173beb211e793f71c175ded2b0f4b
