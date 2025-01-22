import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Button, Text, DataTable, Chip } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveInventory } from '@/app/store/tables/inventorySlice'
import type { RootState, AppDispatch } from '@/app/store'
import type { EntityState, InventoryData } from '@/app/utils/types'


const Expired = () => {
  
  const dispatch = useDispatch<AppDispatch>()
  const data: EntityState<InventoryData> = useSelector((state: RootState) => state.inventory)
  

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: "" }))
  }, [])

  console.log("test", data)

  const renderRow = (item: InventoryData) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.card_id}</DataTable.Cell>
      <DataTable.Cell>{item.supply_id}</DataTable.Cell>
      <DataTable.Cell>{item.quantity}</DataTable.Cell>
      <DataTable.Cell><Chip>{item.expiry_date}</Chip></DataTable.Cell>
    </DataTable.Row>
  )
  
  if (data.loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (data.expired === undefined) {
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
          { data.expired.data.map((item) => renderRow(item)) }
        </DataTable>
    </View>
  )
}

export default Expired