import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-primary bg-button-secondary-bg hover:bg-button-secondary-hover transition-colors hover:cursor-pointer"
    >
      {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
    </button>
  );
};
