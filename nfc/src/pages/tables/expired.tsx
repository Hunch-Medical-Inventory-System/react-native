import React, { useEffect } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Button, Text, Chip, Surface, Card } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveInventory } from '@/store/tables/inventorySlice'
import type { RootState, AppDispatch } from '@/store'
import type { EntityState, InventoryData, SuppliesData } from '@/types/tables'


const Expired = () => {
  
  const dispatch = useDispatch<AppDispatch>()
  const inventoryData: EntityState<InventoryData> = useSelector((state: RootState) => state.inventory)
  const suppliesData: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies)

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: "" }))
  }, [])

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
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (inventoryData.expired === undefined) {
    return (
      <View>
        <Text>No Data</Text>
      </View>
    )
  }

  return (
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