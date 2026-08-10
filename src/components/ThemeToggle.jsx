import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className="relative flex h-9 w-16 items-center rounded-full border border-ink-200 bg-ink-50 px-1 transition-colors duration-300 dark:border-ink-700 dark:bg-ink-800"
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink-700 shadow transition-transform duration-300 dark:bg-ink-900 dark:text-marigold-300 ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? <FiMoon size={14} /> : <FiSun size={14} />}
      </span>
    </button>
  );
};

export default ThemeToggle;
