import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import MyTasks from './pages/MyTasks';
import './App.css';

function App() {
  return (
    <div className="App bg-light min-vh-100">
      <Navbar />
      <div className="pb-5">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (any authenticated user) */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />

          {/* Admin-Only Routes */}
          <Route path="/projects/new" element={<RoleRoute roles={['Admin']}><CreateProject /></RoleRoute>} />
          <Route path="/tasks" element={<RoleRoute roles={['Admin']}><Tasks /></RoleRoute>} />
          <Route path="/tasks/new" element={<RoleRoute roles={['Admin']}><CreateTask /></RoleRoute>} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="container mt-5 text-center">
                <h1 className="display-1 fw-bold text-muted">404</h1>
                <h2>Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
