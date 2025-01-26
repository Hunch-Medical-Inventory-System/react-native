import React from 'react'
import { DataTable, Surface, Text } from 'react-native-paper'
import { StyleSheet } from 'react-native'

import items from '@/assets/api/costItems.json'
import { ScrollView } from 'react-native-gesture-handler'

type Item = {
  item: string
  description: string
  cost: string
}

const currentItems: Array<Item> = [...items.current]
const previousItems: Array<Item> = [...items.previous]

const Costs = () => {
  return (
    <Surface style={styles.container}>
        <Text variant='displayMedium' style={styles.text}>Previous Physical Cost Plans</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Previous Item</DataTable.Title>
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title>Cost</DataTable.Title>
          </DataTable.Header>
          {previousItems.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{item.item}</DataTable.Cell>
              <DataTable.Cell>{item.description}</DataTable.Cell>
              <DataTable.Cell>{item.cost}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
        <Text variant='displayMedium' style={styles.text}>Current Physical Cost Plans</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Current Item</DataTable.Title>
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title>Cost</DataTable.Title>
          </DataTable.Header>
          {currentItems.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{item.item}</DataTable.Cell>
              <DataTable.Cell>{item.description}</DataTable.Cell>
              <DataTable.Cell>{item.cost}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
    </Surface>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  text: {
    margin: 20,
    textAlign: 'center',
  }
})

export default Costs