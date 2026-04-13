import { HashRouter as Router, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OverviewPage from "./pages/dashboard/overview/OverviewPage";

import { Toaster } from "@/components/ui/sonner";
import EmployeesPage from "./pages/dashboard/employees/EmployeesPage";
import EditDepartmentPage from "./pages/dashboard/overview/EditDepartmentPage";
import TasksPage from "./pages/dashboard/tasks/TasksPage";
import PrivateRoute from "./lib/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Route */}
        <Route
          path="/overview"
          element={
            <PrivateRoute>
              <OverviewPage />
            </PrivateRoute>
          }
        />
        <Route path="/edit-department/:id" element={<EditDepartmentPage />} />

        <Route path="/employees" element={<EmployeesPage />} />

        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
      <Toaster richColors closeButton={true} />
    </Router>
  );
}

export default App;
