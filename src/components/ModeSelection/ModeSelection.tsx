import React, { useState, ChangeEvent } from 'react';
import { Button } from '@fluentui/react-button';
import { Text } from '@fluentui/react-text';
import { Spinner } from '@fluentui/react-spinner';
import styles from './ModeSelection.module.scss';
import { createTable, joinTable, validateTableId } from '../../services/firebaseService';

interface ModeSelectionProps {
  onModeSelected: (mode: 'new' | 'join', tableId: string, userId: string, userName: string) => void;
  restaurantId: string;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelected, restaurantId }) => {
  const [selectedMode, setSelectedMode] = useState<'new' | 'join' | null>(null);
  const [userName, setUserName] = useState('');
  const [tableId, setTableId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewOrder = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createTable(restaurantId, userName);
      onModeSelected('new', result.tableId, result.userId, userName);
    } catch (err) {
      setError('Failed to create new order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrder = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!tableId.trim()) {
      setError('Please enter a valid Order ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First validate the table ID exists
      const isValid = await validateTableId(tableId.toUpperCase());
      if (!isValid) {
        setError('Order ID not found. Please check and try again.');
        setLoading(false);
        return;
      }

      const result = await joinTable(tableId.toUpperCase(), userName);
      onModeSelected('join', tableId.toUpperCase(), result.userId, userName);
    } catch (err) {
      setError('Failed to join order. Please check the Order ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedMode(null);
    setError(null);
    setTableId('');
    setUserName('');
  };

  if (selectedMode === null) {
    return (
      <div className={styles.container}>
        <div className={styles.modeSelection}>
          <Text as="h1" className={styles.title}>
            Welcome to TindeRestaurant!
          </Text>
          <Text className={styles.subtitle}>
            How would you like to start ordering?
          </Text>
          
          <div className={styles.buttonContainer}>
            <Button
              appearance="primary"
              size="large"
              className={styles.modeButton}
              onClick={() => setSelectedMode('new')}
            >
              New Order
            </Button>
            <Text className={styles.buttonDescription}>
              Start a new order for your table
            </Text>
          </div>

          <div className={styles.buttonContainer}>
            <Button
              appearance="secondary"
              size="large"
              className={styles.modeButton}
              onClick={() => setSelectedMode('join')}
            >
              Join Existing Order
            </Button>
            <Text className={styles.buttonDescription}>
              Join an order using an Order ID
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.userForm}>
        <Button
          appearance="subtle"
          className={styles.backButton}
          onClick={handleBack}
        >
          ← Back
        </Button>

        <Text as="h2" className={styles.formTitle}>
          {selectedMode === 'new' ? 'Start New Order' : 'Join Existing Order'}
        </Text>

        <div className={styles.inputGroup}>
          <Text className={styles.label}>Your Name (Optional)</Text>
          <input
            type="text"
            value={userName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className={styles.input}
            disabled={loading}
          />
        </div>

        {selectedMode === 'join' && (
          <div className={styles.inputGroup}>
            <Text className={styles.label}>Order ID</Text>
            <input
              type="text"
              value={tableId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTableId(e.target.value.toUpperCase())}
              placeholder="Enter Order ID"
              className={styles.input}
              disabled={loading}
            />
          </div>
        )}

        {error && (
          <Text className={styles.error}>{error}</Text>
        )}

        <Button
          appearance="primary"
          size="large"
          className={styles.submitButton}
          onClick={selectedMode === 'new' ? handleNewOrder : handleJoinOrder}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="tiny" />
              {selectedMode === 'new' ? 'Creating Order...' : 'Joining Order...'}
            </>
          ) : (
            selectedMode === 'new' ? 'Create Order' : 'Join Order'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ModeSelection;
