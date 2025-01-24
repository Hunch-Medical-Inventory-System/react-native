import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Text, DataTable, ActivityIndicator, Dialog, Portal } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveInventory } from '@/app/store/tables/inventorySlice';
import type { RootState, AppDispatch } from '@/app/store';
import type { SuppliesData, EntityState } from '@/app/utils/types';

const SuppliesTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const data: EntityState<SuppliesData> = useSelector((state: RootState) => state.supplies);

  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [isNewDialogVisible, setNewDialogVisible] = useState(false);
  const [isEditDialogVisible, setEditDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  useEffect(() => {
    loadSupplies();
  }, [page, itemsPerPage, search]);

  const loadSupplies = () => {
    dispatch(
      retrieveInventory({
        keywords: search,
        page,
        itemsPerPage,
      })
    );
  };

  const toggleNewDialog = () => setNewDialogVisible(!isNewDialogVisible);
  const toggleEditDialog = (id?: number) => {
    setCurrentItemId(id || null);
    setEditDialogVisible(!isEditDialogVisible);
  };
  const toggleDeleteDialog = (id?: number) => {
    setCurrentItemId(id || null);
    setDeleteDialogVisible(!isDeleteDialogVisible);
  };

  const renderRow = (item: SuppliesData) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.type}</DataTable.Cell>
      <DataTable.Cell>{item.item}</DataTable.Cell>
      <DataTable.Cell>{item.strength}</DataTable.Cell>
      <DataTable.Cell>{item.route_of_use}</DataTable.Cell>
      <DataTable.Cell>{item.quantity_in_package}</DataTable.Cell>
      <DataTable.Cell>{item.location}</DataTable.Cell>
      <DataTable.Cell>{new Date(item.created_at).toLocaleDateString()}</DataTable.Cell>
      <DataTable.Cell>
        <Button onPress={() => toggleEditDialog(item.id)}>Edit</Button>
        <Button onPress={() => toggleDeleteDialog(item.id)} color="error">
          Delete
        </Button>
      </DataTable.Cell>
    </DataTable.Row>
  );

  if (data.loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data.current?.data.length) {
    return (
      <View style={styles.centered}>
        <Text>No Data Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search inventory..."
          value={search}
          onChangeText={setSearch}
        />
        <Button mode="contained" onPress={toggleNewDialog}>
          Add New
        </Button>
      </View>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Id</DataTable.Title>
          <DataTable.Title>Type</DataTable.Title>
          <DataTable.Title>Item</DataTable.Title>
          <DataTable.Title>Strength</DataTable.Title>
          <DataTable.Title>Route</DataTable.Title>
          <DataTable.Title>Quantity</DataTable.Title>
          <DataTable.Title>Location</DataTable.Title>
          <DataTable.Title>Created</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>
        {data.current.data.map((item) => renderRow(item))}
      </DataTable>

      <Portal>
        {/* New Dialog */}
        <Dialog visible={isNewDialogVisible} onDismiss={toggleNewDialog}>
          <Dialog.Title>Add New Supply</Dialog.Title>
          <Dialog.Content>
            <Text>New supply form goes here.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={toggleNewDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog visible={isEditDialogVisible} onDismiss={() => toggleEditDialog()}>
          <Dialog.Title>Edit Supply</Dialog.Title>
          <Dialog.Content>
            <Text>Edit form for item ID: {currentItemId}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => toggleEditDialog()}>Close</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog visible={isDeleteDialogVisible} onDismiss={() => toggleDeleteDialog()}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete item ID: {currentItemId}?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => toggleDeleteDialog()}>Cancel</Button>
            <Button onPress={() => toggleDeleteDialog()} color="error">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
  },
});

export default SuppliesTable;
