import { Outlet, Link, useLocation } from "react-router-dom";
import { Dumbbell, Home, ClipboardList, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MobileLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-base-300 flex flex-col pb-20">
      {/* Top Header */}
      <header className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost text-xl normal-case font-bold text-primary"
          >
            🏋️ Gym Tracker
          </Link>
        </div>
        <div className="flex-none">
          <button onClick={logout} className="btn btn-ghost btn-sm text-error">
            Logout
          </button>
        </div>
      </header>

      {/* Dynamic Page Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar (Fixed) */}
      <div className="btm-nav btm-nav-md bg-base-100 border-t border-base-200 z-50">
        <Link to="/" className={isActive("/") ? "active text-primary" : ""}>
          <Home className="w-5 h-5" />
          <span className="btm-nav-label text-xs">Home</span>
        </Link>
        <Link
          to="/exercises"
          className={isActive("/exercises") ? "active text-primary" : ""}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="btm-nav-label text-xs">Katalog</span>
        </Link>
        <Link
          to="/sessions/new"
          className={isActive("/sessions/new") ? "active text-primary" : ""}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="btm-nav-label text-xs">Catat Sesi</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileLayout;
