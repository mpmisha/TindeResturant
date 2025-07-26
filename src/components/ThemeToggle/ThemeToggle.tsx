import React from 'react';
import { Button } from '@fluentui/react-button';
import { WeatherMoon24Regular, WeatherSunny24Regular } from '@fluentui/react-icons';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.scss';

export const ThemeToggle: React.FC = () => {
  const { resolvedTheme, toggleTheme, isSystemDefault } = useTheme();

  const getIcon = () => {
    return resolvedTheme === 'light' ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />;
  };

  const getTitle = () => {
    const currentTheme = resolvedTheme === 'light' ? 'Light' : 'Dark';
    const nextTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    const systemNote = isSystemDefault ? ' (following system preference)' : '';
    return `${currentTheme} theme${systemNote} - Click to switch to ${nextTheme} theme`;
  };

  return (
    <Button
      appearance="subtle"
      icon={getIcon()}
      onClick={toggleTheme}
      title={getTitle()}
      aria-label={getTitle()}
      className={styles.themeToggle}
    />
  );
};

export default ThemeToggle;
