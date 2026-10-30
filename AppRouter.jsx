import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Chat from "../pages/Chat";
import Upload from "../pages/Upload";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";

function AppRouter() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Pages */}

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages */}

        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>

  );

}

export default AppRouter;