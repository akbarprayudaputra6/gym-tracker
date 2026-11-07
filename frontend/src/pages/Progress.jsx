import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  TrendingUp,
  Trophy,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Progress = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exerciseData, setExerciseData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/exercises/${id}/progress`);

        // Sesuai schema 200 OK: { exercise: {...}, data: [...] }
        setExerciseData(response.data.exercise);

        // Mapping array WorkoutSet untuk grafik Recharts
        const formattedHistory = (response.data.data || []).map((item) => ({
          date: item.created_at,
          max_weight: item.weight_kg ? Number(item.weight_kg) : 0,
          reps: item.reps,
          duration: item.duration_seconds,
        }));

        setHistory(formattedHistory);
      } catch (err) {
        setErrorMsg("Gagal memuat riwayat progres latihan.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [id]);

  // Hitung Personal Record (Beban Maksimum Tertinggi)
  const personalRecord =
    history.length > 0
      ? Math.max(...history.map((h) => Number(h.max_weight || h.weight || 0)))
      : 0;

  return (
    <div className="space-y-5 pb-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/exercises")}
          className="btn btn-ghost btn-circle btn-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Analitik Progres</h1>
          <p className="text-xs text-base-content/60">
            {exerciseData ? exerciseData.name : "Memuat data..."}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!loading && !errorMsg && (
        <>
          {/* Card Highlight Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm flex items-center gap-3">
              <div className="bg-warning/10 p-2.5 rounded-xl text-warning">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-base-content/60">
                  BEBAN MAKS (PR)
                </p>
                <h3 className="text-lg font-extrabold text-warning">
                  {personalRecord} kg
                </h3>
              </div>
            </div>

            <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-base-content/60">
                  TOTAL SESI
                </p>
                <h3 className="text-lg font-extrabold text-primary">
                  {history.length} Sesi
                </h3>
              </div>
            </div>
          </div>

          {/* Grafik Recharts */}
          <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              Tren Beban Terangkat (kg)
            </h3>

            {history.length === 0 ? (
              <div className="text-center py-10 text-xs text-base-content/50">
                Belum ada data sesi untuk latihan ini. Catat sesi gym pertamamu!
              </div>
            ) : (
              <div className="w-full h-56 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={history}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#9CA3AF", fontSize: 10 }}
                      tickFormatter={(str) => {
                        const d = new Date(str);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                    />
                    <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#4B5563",
                        borderRadius: "0.5rem",
                        color: "#F9FAFB",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="max_weight"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Progress;
