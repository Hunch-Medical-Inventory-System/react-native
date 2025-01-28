import React from 'react'
import { Divider, Surface, Text } from 'react-native-paper'
import { StyleSheet, ScrollView } from 'react-native'
import Proposal from './Proposal'
import Costs from './Costs'
import Timeline from './Timeline'


const About = () => {
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Surface style={styles.container}>  
        <Text variant="displayLarge" >Our Project</Text>
      </Surface>
        <Divider />
        <Proposal />
        <Divider />
        <Costs />
        <Divider /> 
        <Timeline />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default About