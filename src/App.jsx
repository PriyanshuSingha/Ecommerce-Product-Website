import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col bg-canvas-light text-ink-900 transition-colors duration-300 dark:bg-canvas-dark dark:text-ink-50">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        theme={theme}
        autoClose={2500}
        newestOnTop
        toastClassName="font-body text-sm"
      />
    </div>
  );
}

export default App;
