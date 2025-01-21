import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { retrieveInventory } from '@/app/store/tables/inventorySlice'
import type { RootState, AppDispatch } from '@/app/store'


const Available = () => {
  
  const dispatch = useDispatch<AppDispatch>()
  const data = useSelector((state: RootState) => state.inventory)
  

  useEffect(() => {
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: "" }))
  }, [])

  console.log("test", data)

  return (
    <View>
      {/* <Button
        aria-label="Increment value"
        mode="contained"
        onPress={() => dispatch(retrieveInventory)}
      >
        Refresh
      </Button> */}
      {/* <Text>{count}</Text> */}
      <Text>Available</Text>
    </View>
  )
}

export default Available