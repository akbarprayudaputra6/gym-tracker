import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, Dumbbell, Activity, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Card Header Greeting */}
      <div className="bg-base-100 p-5 rounded-2xl shadow-md border border-base-200">
        <p className="text-xs text-base-content/60 font-medium">
          Selamat Datang Kembali 👋
        </p>
        <h1 className="text-2xl font-extrabold text-primary">{user?.name}</h1>
        <p className="text-xs text-base-content/70 mt-1">
          Siap untuk mencatat dan meningkatkan beban hari ini?
        </p>
      </div>

      {/* Primary CTA (Mobile Ergonomics: Tombol Besar) */}
      <Link
        to="/sessions/new"
        className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
      >
        <PlusCircle className="w-6 h-6" />
        <span className="text-lg">Mulai Sesi Gym</span>
      </Link>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/exercises"
          className="card bg-base-100 p-4 shadow-sm border border-base-200 hover:border-primary transition-all flex flex-col justify-between"
        >
          <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Katalog Latihan</h3>
            <p className="text-[11px] text-base-content/60">
              Lihat & tambah jenis latihan
            </p>
          </div>
        </Link>

        <Link
          to="/exercises"
          className="card bg-base-100 p-4 shadow-sm border border-base-200 hover:border-secondary transition-all flex flex-col justify-between"
        >
          <div className="bg-secondary/10 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Analitik Progres</h3>
            <p className="text-[11px] text-base-content/60">
              Grafik perkembangan beban
            </p>
          </div>
        </Link>
      </div>

      {/* Tips Info */}
      <div className="alert alert-info shadow-sm text-xs py-3">
        <Activity className="w-5 h-5 shrink-0" />
        <span>
          Tips: Catat repetisi dan beban sesegera mungkin setelah set selesai
          agar data tetap akurat!
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
