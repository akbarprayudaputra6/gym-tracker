import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Plus, Search, Dumbbell, TrendingUp, AlertCircle } from "lucide-react";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // State Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // State Modal Tambah Latihan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("push");
  const [newTrackingType, setNewTrackingType] = useState("weight_reps");
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fetch daftar latihan dari Backend API
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await api.get("/exercises");
      setExercises(response.data.data || response.data);
    } catch (err) {
      setErrorMsg("Gagal memuat katalog latihan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // Submit Latihan Baru
  const handleCreateExercise = async (e) => {
    e.preventDefault();
    setModalError("");
    setSubmitting(true);

    try {
      await api.post("/exercises", {
        name: newName,
        category: newCategory,
        tracking_type: newTrackingType,
      });

      setNewName("");
      setIsModalOpen(false);
      fetchExercises(); // Refresh list setelah berhasil tambah
    } catch (err) {
      setModalError(
        err.response?.data?.message || "Gagal menambahkan latihan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Filtering data lokal berdasarkan search & tab kategori
  const filteredExercises = exercises.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Header & Tombol Tambah */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Katalog Latihan</h1>
          <p className="text-xs text-base-content/60">
            Pilih atau buat latihan baru
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-sm gap-1 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs">Tambah</span>
        </button>
      </div>

      {/* Input Pencarian */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-base-content/40" />
        <input
          type="text"
          placeholder="Cari nama latihan (mis: Bench Press)..."
          className="input input-bordered w-full pl-9 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs (DaisyUI) */}
      <div className="tabs tabs-boxed bg-base-100 p-1 justify-around text-xs">
        {["all", "push", "pull", "leg", "core"].map((cat) => (
          <button
            key={cat}
            className={`tab tab-xs capitalize ${selectedCategory === cat ? "tab-active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* State Loading & Error */}
      {loading && (
        <div className="flex justify-center p-8">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Listing Card Latihan */}
      {!loading && !errorMsg && (
        <div className="space-y-2">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-base-content/50 text-xs">
              Tidak ada latihan yang ditemukan.
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-base-100 p-3 rounded-xl border border-base-200 flex items-center justify-between shadow-sm hover:border-primary transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{exercise.name}</h4>
                    <span className="badge badge-ghost badge-xs uppercase text-[10px]">
                      {exercise.category}
                    </span>
                  </div>
                </div>

                {/* Tombol ke Analitik Progres */}
                <button
                  onClick={() => navigate(`/exercises/${exercise.id}/progress`)}
                  className="btn btn-ghost btn-xs text-secondary gap-1"
                  title="Lihat Progres"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[10px]">Progres</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL DAISYUI: TAMBAH LATIHAN KUSTOM */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Tambah Latihan Kustom</h3>

            {modalError && (
              <div className="alert alert-error text-xs mb-3">
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama Latihan</span>
                </label>
                <input
                  type="text"
                  placeholder="Misal: Incline Dumbbell Press"
                  className="input input-bordered w-full"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kategori</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="push">Push (Dada/Bahu/Trisep)</option>
                  <option value="pull">Pull (Punggung/Bisep)</option>
                  <option value="legs">Legs (Kaki)</option>
                  <option value="core">Core (Perut)</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tipe Tracking</span>
                </label>
                <select
                  className="select select-bordered w-full text-xs"
                  value={newTrackingType}
                  onChange={(e) => setNewTrackingType(e.target.value)}
                >
                  <option value="weight_reps">
                    Beban & Repetisi (Weight & Reps)
                  </option>
                  <option value="bodyweight_reps">
                    Hanya Repetisi (Bodyweight)
                  </option>
                  <option value="duration">Durasi / Waktu (Time-based)</option>
                </select>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${submitting ? "loading" : ""}`}
                  disabled={submitting}
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
