import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Button, Text, DataTable, Chip } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveInventory } from '@/app/store/tables/inventorySlice'
import type { RootState, AppDispatch } from '@/app/store'
import type { EntityState, SuppliesData } from '@/app/utils/types'


const Available = () => {
  
  const dispatch = useDispatch<AppDispatch>()
  const data: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies)
  

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: "" }))
  }, [])

  console.log("test", data)

  const renderRow = (item: SuppliesData) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.type}</DataTable.Cell>
      <DataTable.Cell>{item.item}</DataTable.Cell>
      <DataTable.Cell>{item.strength}</DataTable.Cell>
      <DataTable.Cell>{item.route_of_use}</DataTable.Cell>
      <DataTable.Cell>{item.quantity_in_package}</DataTable.Cell>
      <DataTable.Cell>{item.possible_side_effects}</DataTable.Cell>
      <DataTable.Cell>{item.location}</DataTable.Cell>
      <DataTable.Cell>{new Date(item.created_at).toLocaleDateString()}</DataTable.Cell>
    </DataTable.Row>
  )
  
  if (data.loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (data.current === undefined) {
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
            <DataTable.Title>Type</DataTable.Title>
            <DataTable.Title>Item</DataTable.Title>
            <DataTable.Title>Strength</DataTable.Title>
            <DataTable.Title>Route Of Use</DataTable.Title>
            <DataTable.Title>Quantity In Package</DataTable.Title>
            <DataTable.Title>Possible Side Effects</DataTable.Title>
            <DataTable.Title>Location</DataTable.Title>
            <DataTable.Title>Created At</DataTable.Title>
          </DataTable.Header>
          { data.current.data.map((item) => renderRow(item)) }
        </DataTable>
    </View>
  )
}

export default Available