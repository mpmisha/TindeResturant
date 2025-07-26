import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TableData, User, listenToTableUpdates, stopListeningToTableUpdates } from '../services/firebaseService';
import { DatabaseReference } from 'firebase/database';

interface TableContextState {
  tableId: string | null;
  userId: string | null;
  userName: string | null;
  mode: 'new' | 'join' | null;
  tableData: TableData | null;
  currentUser: User | null;
  isConnected: boolean;
  setSession: (mode: 'new' | 'join', tableId: string, userId: string, userName: string) => void;
  clearSession: () => void;
  updateTableData: (data: TableData) => void;
}

const TableContext = createContext<TableContextState | undefined>(undefined);

export const useTable = (): TableContextState => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};

interface TableProviderProps {
  children: ReactNode;
}

export const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  const [tableId, setTableId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [mode, setMode] = useState<'new' | 'join' | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tableRef, setTableRef] = useState<DatabaseReference | null>(null);

  const setSession = (sessionMode: 'new' | 'join', sessionTableId: string, sessionUserId: string, sessionUserName: string) => {
    setMode(sessionMode);
    setTableId(sessionTableId);
    setUserId(sessionUserId);
    setUserName(sessionUserName);
    setIsConnected(true);
  };

  const clearSession = () => {
    // Stop listening to table updates if we're currently listening
    if (tableRef) {
      stopListeningToTableUpdates(tableRef);
      setTableRef(null);
    }

    setMode(null);
    setTableId(null);
    setUserId(null);
    setUserName(null);
    setTableData(null);
    setCurrentUser(null);
    setIsConnected(false);
  };

  const updateTableData = (data: TableData) => {
    setTableData(data);
    
    // Update current user data
    if (userId && data.users[userId]) {
      setCurrentUser(data.users[userId]);
    }
  };

  // Set up real-time listeners when tableId changes
  useEffect(() => {
    if (tableId && isConnected) {
      const ref = listenToTableUpdates(tableId, (data: TableData) => {
        updateTableData(data);
      });
      setTableRef(ref);

      return () => {
        stopListeningToTableUpdates(ref);
      };
    }
  }, [tableId, isConnected]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (tableRef) {
        stopListeningToTableUpdates(tableRef);
      }
    };
  }, [tableRef]);

  const contextValue: TableContextState = {
    tableId,
    userId,
    userName,
    mode,
    tableData,
    currentUser,
    isConnected,
    setSession,
    clearSession,
    updateTableData,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};
