import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import HODDashboard from "./pages/hod/HODDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentLayout from "./layouts/StudentLayout.jsx";
import Academics from "./pages/student/Academics.jsx";
import Resources from "./pages/student/Resources.jsx";
import Marketplace from "./pages/student/Marketplace.jsx";
import Placements from "./pages/student/Placements.jsx";
import Events from "./pages/student/Events.jsx";
import Campus from "./pages/student/Campus.jsx";
import AIAssistant from "./pages/student/AIAssistant.jsx";
import Profile from "./pages/student/Profile.jsx";
import FacultyLayout from "./layouts/FacultyLayout.jsx";
import MyClasses from "./pages/faculty/MyClasses";
import FacultyAttendance from "./pages/faculty/FacultyAttendance.jsx";
import FacultyAssignments from "./pages/faculty/FacultyAssignments.jsx";
import FacultyMarks from "./pages/faculty/FacultyMarks.jsx";
import FacultyResources from "./pages/faculty/FacultyResources.jsx";
import FacultyAnnouncements from "./pages/faculty/FacultyAnnouncements.jsx";
import FacultyManagement from "./pages/hod/FacultyManagement.jsx";
import StudentsManagement from "./pages/hod/StudentsManagement.jsx";
import AttendanceManagement from "./pages/hod/AttendanceManagement.jsx";
import HODReports from "./pages/hod/Reports.jsx";
import HODSettings from "./pages/hod/HODSettings.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import DepartmentManagement from "./pages/admin/DepartmentManagement.jsx";
import SystemSettings from "./pages/admin/SystemSettings.jsx";
import Announcements from "./pages/admin/Announcements.jsx";
import SecurityLogs from "./pages/admin/SecurityLogs.jsx";
import Notifications from "./pages/admin/Notifications.jsx";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<StudentLayout />}>
      <Route index element={<StudentDashboard />} />
      <Route path="academics" element={<Academics />} />
      <Route path="resources" element={<Resources />} />
      <Route path="marketplace" element={<Marketplace />} />
      <Route path="placements" element={<Placements />} />
       <Route path="events" element={<Events />} />
       <Route path="campus" element={<Campus />} />
       <Route path="ai-assistant" element={<AIAssistant />} />
       <Route path="profile" element={<Profile />} />
      </Route>
      
      <Route path="/faculty" element={<FacultyLayout />}>
      <Route index element={<FacultyDashboard />} />
       <Route path="classes" element={<MyClasses />} />
       <Route path="attendance" element={<FacultyAttendance />} />
       <Route path="assignments" element={<FacultyAssignments />} />
       <Route path="marks" element={<FacultyMarks />} />
       <Route path="resources" element={<FacultyResources />} />
       <Route path="announcements" element={<FacultyAnnouncements />} />
      </Route>

      <Route path="/hod" element={<HODDashboard />} />
      <Route path="/hod/faculty" element={<FacultyManagement />} />
      <Route path="/hod/students" element={<StudentsManagement />} />
      <Route path="/hod/attendance" element={<AttendanceManagement />} />
      <Route path="/hod/reports" element={<HODReports />} />
      <Route path="/hod/settings" element={<HODSettings />} />

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}></Route>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/departments" element={<DepartmentManagement />}/>
      <Route path="/admin/settings" element={<SystemSettings />} />
      <Route path="/admin/announcements" element={<Announcements />}/>
      <Route path="/admin/security" element={<SecurityLogs />}/>
      <Route path="/admin/notifications" element={<Notifications />}/>
      <Route path="/admin/reports" element={<ReportsAnalytics />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;