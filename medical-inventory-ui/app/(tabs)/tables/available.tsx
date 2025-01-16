// app/tabs/tables/available.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveInventory } from '../../store/inventorySlice';
import { RootState } from '../../store';

const AvailableTable = () => {
  const dispatch = useDispatch();
  const { currentInventory, inventoryLoading } = useSelector(
    (state: RootState) => state.inventory
  );

  useEffect(() => {
    // Dispatch the async action
    dispatch(retrieveInventory({ itemsPerPage: 10, page: 1, keywords: '' }));
  }, [dispatch]);

  if (inventoryLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Available Inventory</h1>
      <ul>
        {currentInventory.data.map((item, idx) => (
          <li key={idx}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableTable;
