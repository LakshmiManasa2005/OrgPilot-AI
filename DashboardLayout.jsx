import { NavLink, Outlet } from "react-router-dom";
import "../pages/dashboard.css";

function DashboardLayout() {
    return (
        <div className="dashboard">

            <aside className="sidebar">

                <div className="sidebar-brand">
                    <div className="brand-icon">✦</div>
                    <div>
                        <h2>OrgPilot AI</h2>
                        <span>SMART DOCUMENT HUB</span>
                    </div>
                </div>

                <p className="nav-heading">MAIN MENU</p>

                <nav className="sidebar-nav">

                    <NavLink to="/dashboard" className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }>
                        <span className="nav-icon">⌂</span>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/chat" className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }>
                        <span className="nav-icon">✧</span>
                        <span>AI Chat</span>
                    </NavLink>

                    <NavLink to="/upload" className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }>
                        <span className="nav-icon">⇧</span>
                        <span>Upload Documents</span>
                    </NavLink>

                    <NavLink to="/profile" className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }>
                        <span className="nav-icon">♙</span>
                        <span>My Profile</span>
                    </NavLink>

                </nav>

                <div className="sidebar-footer">
                    <div className="footer-icon">✦</div>
                    <div>
                        <strong>OrgPilot AI</strong>
                        <p>Your intelligent workspace</p>
                    </div>
                </div>

            </aside>

            <div className="dashboard-content-shell">
                <Outlet />
            </div>

        </div>
    );
}

export default DashboardLayout;