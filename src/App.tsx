import React, { useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { FluentProvider } from '@fluentui/react-provider';
import { webLightTheme } from '@fluentui/react-theme';
import RestaurantMenu from './pages/RestaurantMenu';
import { getAvailableRestaurants } from './utils/restaurantLoader';
import './styles/global.scss';

// Component to handle default redirect
const DefaultRedirect: React.FC = () => {
  const defaultRestaurant = useMemo(() => {
    const restaurants = getAvailableRestaurants();
    return restaurants.length > 0 ? restaurants[0] : 'bella-vista';
  }, []);

  return <Navigate to={`/restaurant/${defaultRestaurant}`} replace />;
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <FluentProvider theme={webLightTheme}>
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
      </FluentProvider>
    </RecoilRoot>
  );
};

export default App;
