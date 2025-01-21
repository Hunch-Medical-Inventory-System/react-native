import React from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/app/store'
import { retrieveInventory } from '@/app/store/tables/inventorySlice'


const Available = () => {
  
  const dispatch = useDispatch()
  const data = useSelector((state: RootState) => state.counter.value)
  console.log(data)
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
    </View>
  )
}

export default Available