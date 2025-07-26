import React, { ReactNode } from 'react';
import { TableData, User } from '../services/firebaseService';
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
export declare const useTable: () => TableContextState;
interface TableProviderProps {
    children: ReactNode;
}
export declare const TableProvider: React.FC<TableProviderProps>;
export {};
//# sourceMappingURL=TableContext.d.ts.map