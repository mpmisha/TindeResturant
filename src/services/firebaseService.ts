import { ref, set, get, push, onValue, off, update, DatabaseReference } from 'firebase/database';
import { database } from '../config/firebaseConfig';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface TableData {
  users: { [userId: string]: User };
  selections: { [menuItemId: string]: string[] }; // Array of user IDs who selected this item
  restaurantId: string;
}

// Generate a unique table ID
export const generateTableId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Generate a unique user ID
export const generateUserId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Color palette for users
const USER_COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#FFB733',
  '#33FFF1', '#F133FF', '#57FF33', '#FF3357', '#3397FF'
];

// Get a color for a user based on their position in the table
export const getUserColor = (userIndex: number): string => {
  return USER_COLORS[userIndex % USER_COLORS.length];
};

// Create a new table
export const createTable = async (restaurantId: string, userName: string): Promise<{ tableId: string; userId: string }> => {
  const tableId = generateTableId();
  const userId = generateUserId();
  const userColor = getUserColor(0); // First user gets the first color

  const user: User = {
    id: userId,
    name: userName || `User 1`,
    color: userColor
  };

  const tableData: TableData = {
    users: { [userId]: user },
    selections: {},
    restaurantId
  };

  try {
    await set(ref(database, `tables/${tableId}`), tableData);
    return { tableId, userId };
  } catch (error) {
    console.error('Error creating table:', error);
    throw new Error('Failed to create table');
  }
};

// Join an existing table
export const joinTable = async (tableId: string, userName: string): Promise<{ userId: string; tableData: TableData }> => {
  try {
    const tableRef = ref(database, `tables/${tableId}`);
    const snapshot = await get(tableRef);
    
    if (!snapshot.exists()) {
      throw new Error('Table not found');
    }

    const tableData = snapshot.val() as TableData;
    const userCount = Object.keys(tableData.users).length;
    const userId = generateUserId();
    const userColor = getUserColor(userCount);

    const user: User = {
      id: userId,
      name: userName || `User ${userCount + 1}`,
      color: userColor
    };

    // Add the new user to the table
    await update(ref(database, `tables/${tableId}/users`), {
      [userId]: user
    });

    // Return updated table data
    const updatedSnapshot = await get(tableRef);
    return { userId, tableData: updatedSnapshot.val() as TableData };
  } catch (error) {
    console.error('Error joining table:', error);
    throw new Error('Failed to join table');
  }
};

// Update user selections for a table
export const updateSelections = async (tableId: string, userId: string, selectedItems: string[]): Promise<void> => {
  try {
    const selectionsRef = ref(database, `tables/${tableId}/selections`);
    const snapshot = await get(selectionsRef);
    const currentSelections = snapshot.val() || {};

    // Update selections with the new user's choices
    const updatedSelections = { ...currentSelections };
    
    selectedItems.forEach(itemId => {
      if (!updatedSelections[itemId]) {
        updatedSelections[itemId] = [];
      }
      if (!updatedSelections[itemId].includes(userId)) {
        updatedSelections[itemId].push(userId);
      }
    });

    await set(selectionsRef, updatedSelections);
  } catch (error) {
    console.error('Error updating selections:', error);
    throw new Error('Failed to update selections');
  }
};

// Get table data
export const getTableData = async (tableId: string): Promise<TableData> => {
  try {
    const snapshot = await get(ref(database, `tables/${tableId}`));
    if (!snapshot.exists()) {
      throw new Error('Table not found');
    }
    return snapshot.val() as TableData;
  } catch (error) {
    console.error('Error getting table data:', error);
    throw new Error('Failed to get table data');
  }
};

// Listen to table updates (real-time)
export const listenToTableUpdates = (tableId: string, callback: (tableData: TableData) => void): DatabaseReference => {
  const tableRef = ref(database, `tables/${tableId}`);
  onValue(tableRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as TableData);
    }
  });
  return tableRef;
};

// Stop listening to table updates
export const stopListeningToTableUpdates = (tableRef: DatabaseReference): void => {
  off(tableRef);
};

// Validate table ID exists
export const validateTableId = async (tableId: string): Promise<boolean> => {
  try {
    const snapshot = await get(ref(database, `tables/${tableId}`));
    return snapshot.exists();
  } catch (error) {
    console.error('Error validating table ID:', error);
    return false;
  }
};
