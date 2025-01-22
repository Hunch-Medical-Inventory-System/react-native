import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Text, DataTable, Chip } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveInventory } from '@/app/store/tables/inventorySlice'
import type { RootState, AppDispatch } from '@/app/store'
import type { EntityState, InventoryData, SuppliesData } from '@/app/utils/types'


const Available = () => {
  
  const dispatch = useDispatch<AppDispatch>()
  const inventoryData: EntityState<InventoryData> = useSelector((state: RootState) => state.inventory)
  const suppliesData: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies)
  

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: "" }))
  }, [])

  console.log("test", inventoryData)

  const renderRow = (item: InventoryData) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.card_id}</DataTable.Cell>
      <DataTable.Cell>
        { 
          suppliesData.loading ? 
          'Loading...' : 
          suppliesData.current.data.find(supply => supply.id === item.supply_id)?.item 
        }
      </DataTable.Cell>
      <DataTable.Cell>{item.quantity}</DataTable.Cell>
      <DataTable.Cell><Chip>{item.expiry_date}</Chip></DataTable.Cell>
    </DataTable.Row>
  )
  
  if (inventoryData.loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (inventoryData.current === undefined) {
    return (
      <View>
        <Text>No Data</Text>
      </View>
    )
  }

  return (
    <View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Id</DataTable.Title>
            <DataTable.Title>Card Id</DataTable.Title>
            <DataTable.Title>Supply Id</DataTable.Title>
            <DataTable.Title>Quantity</DataTable.Title>
            <DataTable.Title>Expiry Date</DataTable.Title>
          </DataTable.Header>
          { inventoryData.current.data.map((item) => renderRow(item)) }
        </DataTable>
    </View>
  )
}

export default Available