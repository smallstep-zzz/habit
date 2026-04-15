import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';

// Components
import Layout from './components/Layout';
import Main from './pages/Main';
import HabitManagement from './pages/HabitManagement';
import Account from './pages/Account';
import Onboarding from './pages/Onboarding';

import InitialSetup from './pages/InitialSetup';

function PrivateRoute({ children }) {
  const user = useStore(state => state.user);
  const habits = useStore(state => state.habits);
  
  if (!user) {
    return <Navigate to="/welcome" replace />;
  }
  
  // If user is logged in but has no habits, go to initial setup
  // Wait, but what if they are navigating TO /initial-setup? We don't want infinite loop.
  // Actually, Route level logic is better or we just navigate them if they hit PrivateRoute.
  return children;
}

function MainRoute({ children }) {
  const habits = useStore(state => state.habits);
  if (habits.length === 0) {
    return <Navigate to="/initial-setup" replace />;
  }
  return children;
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/welcome" element={<Onboarding />} />
        
        <Route path="/initial-setup" element={
          <PrivateRoute>
            <InitialSetup />
          </PrivateRoute>
        } />

        
        <Route path="/" element={
          <PrivateRoute>
            <MainRoute>
              <Layout />
            </MainRoute>
          </PrivateRoute>
        }>
          <Route index element={<Main />} />
          <Route path="management" element={<HabitManagement />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
