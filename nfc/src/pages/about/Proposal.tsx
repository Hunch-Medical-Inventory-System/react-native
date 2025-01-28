import React from 'react'
import { StyleSheet } from 'react-native'
import { Divider, Surface, Text } from 'react-native-paper'

const Proposal = () => {
  return (
    <Surface style={styles.container} >
      <Text variant="bodyLarge" style={styles.text} >
      This project is a prototype of a medical inventory system. It will be an inventory system based on RFID and NFC
      that tracks items and the person who took them. RFID would be
      used to find what is still in the inventory and report it to the database for manipulation and display. NFC would
      be used to track who took what. On the top level to use this system, the crew member would scan a designated NFC
      tag (smartwatches would work) to access the supplies. When the NFC tag is scanned the crewmember will be logged
      and the system will take an initial check of what is currently in inventory. The crewmember will then be able to
      take the supplies they need. When the crewmember closes access to the supplies, there will be a final check of
      what is currently in inventory. The final supplies count will be updated on the database and using the difference
      between the initial and final we'll see what was taken and will be put in a database along with the crewmember
      that scanned their NFC tag. The database would be available in a sortable crewmember-specific web interface where
      each crewmember can see their supplies and what they have taken.
    </Text>
    <Text variant="bodyLarge" style={styles.text} >
      The under the hood components of this project are currently a Vue: front-end, Supabase backend, and simple nodejs
      server to communicate RFID/NFC info. We chose these options for very simple reasons. Vue gives us flexibility in
      how we manipulate the web interface and we are most familiar with vue out of the many javascript frameworks.
      Supabase gives us the scalability of firebase while still offering the option of self hosting on a device like a
      raspberry pi. Node.js has extensive documentation on RFID scanners and integrates with Vue quite nicely. This also
      makes the only language proficiencies needed for adding functionality being javascript.
    </Text>
    <Text variant="bodyLarge" style={styles.text} >
      This system being a web interface it would give easy-access to add extended functionality in the future. To name a
      few would be to give the power to show each crew member what resources are available to them specifically. It can
      take the flexibility of conversions between doses -{'>'} pill count, kg -{'>'} lb, etc. This system would also be able to
      integrate with drugs going bad and moving the count down as drugs go bad.
    </Text>
    </Surface>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    margin: 20,
    
  },
})

export default Proposal