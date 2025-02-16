import React from 'react'
import { Divider, Surface, Text } from 'react-native-paper'
import { StyleSheet, ScrollView } from 'react-native'
import Proposal from '@/components/about/Proposal'
import Costs from '@/components/about/Costs'
import Timeline from '@/components/about/Timeline'


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
    backgroundColor: '#0F0F1F'
  },
})

export default About