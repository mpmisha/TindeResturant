import React, { useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { FluentProvider } from '@fluentui/react-provider';
import { webLightTheme, webDarkTheme } from '@fluentui/react-theme';
import RestaurantMenu from './pages/RestaurantMenu';
import ModeSelection from './components/ModeSelection/ModeSelection';
import { getAvailableRestaurants } from './utils/restaurantLoader';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { TableProvider, useTable } from './contexts/TableContext';
import './styles/global.scss';


// Theme-aware Fluent Provider
const ThemedFluentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const fluentTheme = resolvedTheme === 'dark' ? webDarkTheme : webLightTheme;
  
  return (
    <FluentProvider theme={fluentTheme}>
      {children}
    </FluentProvider>
  );
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { isConnected, setSession } = useTable();
  const defaultRestaurant = useMemo(() => {
    const restaurants = getAvailableRestaurants();
    return restaurants.length > 0 ? restaurants[0] : 'bella-vista';
  }, []);

  const handleModeSelected = (mode: 'new' | 'join', tableId: string, userId: string, userName: string) => {
    setSession(mode, tableId, userId, userName);
  };

  if (!isConnected) {
    return (
      <ModeSelection
        onModeSelected={handleModeSelected}
        restaurantId={defaultRestaurant}
      />
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Restaurant-specific routes */}
          <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
          
          {/* Default route - redirect to first available restaurant */}
          <Route path="/" element={<Navigate to={`/restaurant/${defaultRestaurant}`} replace />} />
          
          {/* Catch-all route - redirect to first restaurant */}
          <Route path="*" element={<Navigate to={`/restaurant/${defaultRestaurant}`} replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <TableProvider>
          <ThemedFluentProvider>
            <AppContent />
          </ThemedFluentProvider>
        </TableProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
