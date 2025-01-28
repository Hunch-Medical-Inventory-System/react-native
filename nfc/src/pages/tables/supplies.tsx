import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Text, DataTable, ActivityIndicator, Dialog, Portal } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveInventory, addInventory, updateInventory, deleteInventory } from '@/store/tables/inventorySlice';
import { retrieveSupplies } from '@/store/tables/suppliesSlice';
import type { RootState, AppDispatch } from '@/store';
import type { SuppliesData, EntityState } from '@/types/tables';



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
  const [formData, setFormData] = useState<SuppliesData>({
    id: 0,
    type: '',
    item: '',
    strength_or_volume: '',
    route_of_use: '',
    quantity_in_pack: 0,
    possible_side_effects: '',
    location: '',
    is_deleted: false,
    created_at: new Date().toISOString(),
  });

  useEffect(() => {
    loadSupplies();
  }, [page, itemsPerPage, search]);

  const loadSupplies = () => {
    dispatch(
      retrieveSupplies({
        keywords: search,
        page,
        itemsPerPage,
      })
    );
  };

  const toggleNewDialog = () => {
    setFormData({
      id: 0,
      type: '',
      item: '',
      strength_or_volume: '',
      route_of_use: '',
      quantity_in_pack: 0,
      possible_side_effects: '',
      location: '',
      is_deleted: false,
      created_at: new Date().toISOString(),
    });
    setNewDialogVisible(!isNewDialogVisible);
  };

  const toggleEditDialog = (id?: number) => {
    if (id) {
      const item = data.current.data.find((item) => item.id === id);
      if (item) setFormData(item);
    }
    setCurrentItemId(id || null);
    setEditDialogVisible(!isEditDialogVisible);
  };

  const toggleDeleteDialog = (id?: number) => {
    setCurrentItemId(id || null);
    setDeleteDialogVisible(!isDeleteDialogVisible);
  };

  const handleAdd = () => {
    // dispatch(addInventory(formData));
    toggleNewDialog();
  };

  const handleEdit = () => {
    if (currentItemId !== null) {
      // dispatch(updateInventory({ ...formData, id: currentItemId }));
    }
    toggleEditDialog();
  };

  const handleDelete = () => {
    if (currentItemId !== null) {
      dispatch(deleteInventory(currentItemId));
    }
    toggleDeleteDialog();
  };

  const renderRow = (item: SuppliesData) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.type}</DataTable.Cell>
      <DataTable.Cell>{item.item}</DataTable.Cell>
      <DataTable.Cell>{item.strength_or_volume}</DataTable.Cell>
      <DataTable.Cell>{item.route_of_use}</DataTable.Cell>
      <DataTable.Cell>{item.quantity_in_pack}</DataTable.Cell>
      <DataTable.Cell>{item.possible_side_effects}</DataTable.Cell>
      <DataTable.Cell>{item.location}</DataTable.Cell>
      <DataTable.Cell>{item.is_deleted ? 'Yes' : 'No'}</DataTable.Cell>
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

      <View style={styles.searchContainer}>
  <TextInput
    style={styles.searchInput}
    placeholder="Search inventory..." // Updated from 'label' to 'placeholder'
    value={search}
    onChangeText={setSearch}
  />
  <Button mode="contained" onPress={toggleNewDialog}>
    Add New
  </Button>
</View>

<Portal>
  {/* New Dialog */}
  <Dialog visible={isNewDialogVisible} onDismiss={toggleNewDialog}>
    <Dialog.Title>Add New Supply</Dialog.Title>
    <Dialog.Content>
      <TextInput
        style={styles.input}
        placeholder="Type"
        value={formData.type}
        onChangeText={(text) => setFormData({ ...formData, type: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Item"
        value={formData.item}
        onChangeText={(text) => setFormData({ ...formData, item: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Strength or Volume"
        value={formData.strength_or_volume}
        onChangeText={(text) => setFormData({ ...formData, strength_or_volume: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Route of Use"
        value={formData.route_of_use}
        onChangeText={(text) => setFormData({ ...formData, route_of_use: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity in Pack"
        value={formData.quantity_in_pack.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setFormData({ ...formData, quantity_in_pack: parseInt(text) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Possible Side Effects"
        value={formData.possible_side_effects}
        onChangeText={(text) => setFormData({ ...formData, possible_side_effects: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
      />
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={toggleNewDialog}>Cancel</Button>
      <Button onPress={handleAdd}>Add</Button>
    </Dialog.Actions>
  </Dialog>

  {/* Edit Dialog */}
  <Dialog visible={isEditDialogVisible} onDismiss={() => toggleEditDialog()}>
    <Dialog.Title>Edit Supply</Dialog.Title>
    <Dialog.Content>
      <TextInput
        style={styles.input}
        placeholder="Type"
        value={formData.type}
        onChangeText={(text) => setFormData({ ...formData, type: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Item"
        value={formData.item}
        onChangeText={(text) => setFormData({ ...formData, item: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Strength or Volume"
        value={formData.strength_or_volume}
        onChangeText={(text) => setFormData({ ...formData, strength_or_volume: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Route of Use"
        value={formData.route_of_use}
        onChangeText={(text) => setFormData({ ...formData, route_of_use: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity in Pack"
        value={formData.quantity_in_pack.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setFormData({ ...formData, quantity_in_pack: parseInt(text) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Possible Side Effects"
        value={formData.possible_side_effects}
        onChangeText={(text) => setFormData({ ...formData, possible_side_effects: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
      />
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={() => toggleEditDialog()}>Cancel</Button>
      <Button onPress={handleEdit}>Save</Button>
    </Dialog.Actions>
  </Dialog>

  {/* Delete Confirmation Dialog */}
  <Dialog visible={isDeleteDialogVisible} onDismiss={() => toggleDeleteDialog()}>
    <Dialog.Title>Confirm Delete</Dialog.Title>
    <Dialog.Content>
      <Text>Are you sure you want to delete this supply?</Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={() => toggleDeleteDialog()}>Cancel</Button>
      <Button onPress={handleDelete} color="error">
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
  input: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
});

export default SuppliesTable;
