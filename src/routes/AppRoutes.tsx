import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Projects from '../pages/Projects';
import ProjectForm from '../pages/ProjectForm';
import Resume from '../pages/Resume';
import PortfolioSettings from '../pages/PortfolioSettings';
import TemplateGallery from '../pages/TemplateGallery';
import PublicPortfolio from '../pages/PublicPortfolio';
import NotFound from '../pages/NotFound';
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from '../auth/ProtectedRoute';
import AuthRedirect from '../components/AuthRedirect';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthLayout>
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          </AuthLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          </AuthLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Projects />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectForm />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/edit/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectForm />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Resume />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PortfolioSettings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio/templates"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TemplateGallery />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/u/:username"
        element={<PublicPortfolio />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

