import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import NewComplaint from './pages/NewComplaint';
import MyComplaints from './pages/MyComplaints';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import AdminDepartments from './pages/AdminDepartments';
import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';
import DeptDashboard from './pages/DeptDashboard';
import DeptComplaints from './pages/DeptComplaints';
import Profile from './pages/Profile';
import FeedbackForm from "./pages/FeedbackForm";

function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role))
    return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Student / Faculty */}
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['student', 'faculty']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/complaints" element={
          <ProtectedRoute roles={['student', 'faculty']}>
            <MyComplaints />
          </ProtectedRoute>
        } />
        <Route path="/complaints/new" element={
          <ProtectedRoute roles={['student', 'faculty']}>
            <NewComplaint />
          </ProtectedRoute>
        } />

        {/* Feedback */}
        <Route path="/feedback/:id" element={
          <ProtectedRoute roles={['student', 'faculty']}>
            <FeedbackForm />
          </ProtectedRoute>
        } />

        {/* Profile - All Roles */}
        <Route path="/profile" element={
          <ProtectedRoute roles={['student', 'faculty', 'admin', 'staff']}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/complaints" element={
          <ProtectedRoute roles={['admin']}>
            <AdminComplaints />
          </ProtectedRoute>
        } />
        <Route path="/admin/departments" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDepartments />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute roles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        } />

        {/* Staff */}
        <Route path="/dept" element={
          <ProtectedRoute roles={['staff']}>
            <DeptDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dept/complaints" element={
          <ProtectedRoute roles={['staff']}>
            <DeptComplaints />
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}