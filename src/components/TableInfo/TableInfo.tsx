import React, { useState } from 'react';
import { Button } from '@fluentui/react-button';
import { Text } from '@fluentui/react-text';
import styles from './TableInfo.module.scss';
import { useTable } from '../../contexts/TableContext';

const TableInfo: React.FC = () => {
  const { tableId, mode, userName, tableData, clearSession } = useTable();
  const [copied, setCopied] = useState(false);

  const handleCopyTableId = async () => {
    if (tableId) {
      try {
        await navigator.clipboard.writeText(tableId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = tableId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleLeaveTable = () => {
    clearSession();
  };

  const userCount = tableData ? Object.keys(tableData.users).length : 1;
  const otherUsers = tableData ? Object.values(tableData.users).filter(user => user.name !== userName) : [];

  return (
    <div className={styles.container}>
      <div className={styles.tableInfo}>
        <div className={styles.header}>
          <Text className={styles.mode}>
            {mode === 'new' ? 'Your Order' : 'Joined Order'}
          </Text>
          <Button
            appearance="subtle"
            size="small"
            className={styles.leaveButton}
            onClick={handleLeaveTable}
          >
            Leave
          </Button>
        </div>

        <div className={styles.tableIdSection}>
          <Text className={styles.label}>Order ID:</Text>
          <div className={styles.tableIdContainer}>
            <Text className={styles.tableId}>{tableId}</Text>
            <Button
              appearance="subtle"
              size="small"
              className={styles.copyButton}
              onClick={handleCopyTableId}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className={styles.usersSection}>
          <Text className={styles.label}>
            Table Members ({userCount}):
          </Text>
          <div className={styles.usersList}>
            <div className={styles.userItem}>
              <div 
                className={styles.userColor} 
                style={{ backgroundColor: tableData?.users[Object.keys(tableData.users).find(id => tableData.users[id].name === userName) || '']?.color || '#FF5733' }}
              />
              <Text className={styles.userName}>{userName} (You)</Text>
            </div>
            {otherUsers.map((user, index) => (
              <div key={user.id} className={styles.userItem}>
                <div 
                  className={styles.userColor} 
                  style={{ backgroundColor: user.color }}
                />
                <Text className={styles.userName}>{user.name}</Text>
              </div>
            ))}
          </div>
        </div>

        {mode === 'new' && userCount === 1 && (
          <Text className={styles.shareMessage}>
            Share the Order ID with others to let them join your table!
          </Text>
        )}
      </div>
    </div>
  );
};

export default TableInfo;
