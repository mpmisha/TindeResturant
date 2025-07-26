import React, { useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { FluentProvider } from '@fluentui/react-provider';
import { webLightTheme, webDarkTheme } from '@fluentui/react-theme';
import RestaurantMenu from './pages/RestaurantMenu';
import { getAvailableRestaurants } from './utils/restaurantLoader';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './styles/global.scss';

// Component to handle default redirect
const DefaultRedirect: React.FC = () => {
  const defaultRestaurant = useMemo(() => {
    const restaurants = getAvailableRestaurants();
    return restaurants.length > 0 ? restaurants[0] : 'bella-vista';
  }, []);

  return <Navigate to={`/restaurant/${defaultRestaurant}`} replace />;
};

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

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Restaurant-specific routes */}
          <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
          
          {/* Default route - redirect to first available restaurant for demo */}
          <Route path="/" element={<DefaultRedirect />} />
          
          {/* Catch-all route - redirect to first restaurant */}
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <ThemedFluentProvider>
          <AppRoutes />
        </ThemedFluentProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
