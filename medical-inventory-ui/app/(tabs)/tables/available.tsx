import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveInventory } from '@/app/store/tables/inventorySlice'
import type { RootState, AppDispatch } from '@/app/store'
import type { EntityState, InventoryData } from '@/app/utils/types'


const Available = () => {
  
  const dispatch = useDispatch<AppDispatch>()
  const data: EntityState<InventoryData> = useSelector((state: RootState) => state.inventory)
  

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: "" }))
  }, [])

  console.log("test", data)

  return (
    <View>
      <Button
        aria-label="Increment value"
        mode="contained"
        onPress={() => dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: "" }))}
      >
        Refresh
      </Button>
      {/* <Text>{count}</Text> */}
      <Text>Available</Text>
      {
        data.loading ? <Text>Loading...</Text> :
        data.current.data.map((item: InventoryData) => (
          <Text key={item.id}>{item.id}: {item.supply_id}</Text>
        ))
      }
    </View>
  )
}

export default Available