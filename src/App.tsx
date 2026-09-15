import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Ambulances from './pages/Ambulances';
import Staff from './pages/Staff';
import Resources from './pages/Resources';
import Triage from './pages/Triage';
import { handleGoogleRedirect } from './lib/googleAuth';

handleGoogleRedirect();

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppProvider>
                  <Layout />
                </AppProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="ambulances" element={<Ambulances />} />
            <Route path="staff" element={<Staff />} />
            <Route path="resources" element={<Resources />} />
            <Route path="triage" element={<Triage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
