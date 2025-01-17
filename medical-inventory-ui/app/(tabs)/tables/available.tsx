import React from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/app/store'
import { decrement, increment } from '@/app/store/counterSlice'

const Available = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <View>
      <Button
        aria-label="Increment value"
        mode="contained"
        onPress={() => dispatch(increment())}
      >
        Increment
      </Button>
      <Text>{count}</Text>
      <Button
        aria-label="Decrement value"
        mode="contained"
        onPress={() => dispatch(decrement())}
      >
        Decrement
      </Button>
    </View>
  )
}

export default Available