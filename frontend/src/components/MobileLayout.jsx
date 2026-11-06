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

      {/* Bottom Navigation Bar (Fixed & Responsive) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-base-100 border-t border-base-200 flex flex-row items-center justify-around max-w-md mx-auto">
        <Link
          to="/"
          className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all ${
            isActive("/")
              ? "text-primary font-semibold border-t-2 border-primary -mt-[2px]"
              : "text-base-content/60 hover:text-base-content"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </Link>

        <Link
          to="/exercises"
          className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all ${
            isActive("/exercises")
              ? "text-primary font-semibold border-t-2 border-primary -mt-"
              : "text-base-content/60 hover:text-base-content"
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[11px]">Katalog</span>
        </Link>

        <Link
          to="/sessions/new"
          className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all ${
            isActive("/sessions/new")
              ? "text-primary font-semibold border-t-2 border-primary -mt-"
              : "text-base-content/60 hover:text-base-content"
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[11px]">Catat Sesi</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileLayout;
