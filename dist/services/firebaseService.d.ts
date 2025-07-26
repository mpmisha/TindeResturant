import { DatabaseReference } from 'firebase/database';
export interface User {
    id: string;
    name: string;
    color: string;
}
export interface TableData {
    users: {
        [userId: string]: User;
    };
    selections: {
        [menuItemId: string]: string[];
    };
    restaurantId: string;
}
export declare const generateTableId: () => string;
export declare const generateUserId: () => string;
export declare const getUserColor: (userIndex: number) => string;
export declare const createTable: (restaurantId: string, userName: string) => Promise<{
    tableId: string;
    userId: string;
}>;
export declare const joinTable: (tableId: string, userName: string) => Promise<{
    userId: string;
    tableData: TableData;
}>;
export declare const updateSelections: (tableId: string, userId: string, selectedItems: string[]) => Promise<void>;
export declare const getTableData: (tableId: string) => Promise<TableData>;
export declare const listenToTableUpdates: (tableId: string, callback: (tableData: TableData) => void) => DatabaseReference;
export declare const stopListeningToTableUpdates: (tableRef: DatabaseReference) => void;
export declare const validateTableId: (tableId: string) => Promise<boolean>;
//# sourceMappingURL=firebaseService.d.ts.map