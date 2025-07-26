import React, { useState } from 'react';
import { Button } from '@fluentui/react-button';
import { Text } from '@fluentui/react-text';
import { Divider } from '@fluentui/react-divider';
import { NavigationRegular, DismissRegular, HomeRegular } from '@fluentui/react-icons';
import { useTable } from '../../contexts/TableContext';
import TableInfo from '../TableInfo/TableInfo';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Menu.module.scss';

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { clearSession, isConnected } = useTable();

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const handleGoHome = () => {
    clearSession();
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        appearance="subtle"
        icon={<NavigationRegular />}
        onClick={handleToggleMenu}
        className={styles.menuButton}
        title="Open menu"
      />

      {/* Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={handleCloseMenu} />
      )}

      {/* Menu Panel */}
      <div className={`${styles.menuPanel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuHeader}>
          <Text size={500} weight="semibold" className={styles.menuTitle}>
            Menu
          </Text>
          <Button
            appearance="subtle"
            icon={<DismissRegular />}
            onClick={handleCloseMenu}
            className={styles.closeButton}
            title="Close menu"
          />
        </div>

        <div className={styles.menuContent}>
          {/* Navigation Section */}
          <div className={styles.menuSection}>
            <Button
              appearance="outline"
              icon={<HomeRegular />}
              onClick={handleGoHome}
              className={styles.menuItemButton}
            >
              Return to Main Flow
            </Button>
          </div>

          <Divider />

          {/* Theme Toggle Section */}
          <div className={styles.menuSection}>
            <Text size={400} weight="semibold" className={styles.sectionTitle}>
              Theme
            </Text>
            <div className={styles.themeContainer}>
              <ThemeToggle />
            </div>
          </div>

          <Divider />

          {/* Table Info Section - only show if connected */}
          {isConnected && (
            <>
              <div className={styles.menuSection}>
                <Text size={400} weight="semibold" className={styles.sectionTitle}>
                  Table Information
                </Text>
                <div className={styles.tableInfoContainer}>
                  <TableInfo />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Menu;
