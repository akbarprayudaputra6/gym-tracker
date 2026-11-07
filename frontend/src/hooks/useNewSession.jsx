import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sessionService } from "../services/SessionService";

export const useNewSession = () => {
  const navigate = useNavigate();

  const [exerciseCatalog, setExerciseCatalog] = useState([]);
  const [sessionNotes, setSessionNotes] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeExerciseId, setActiveExerciseId] = useState("");

  // Fetch Katalog Latihan dari Backend API
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await sessionService.getExercisesCatalog();
        setExerciseCatalog(response.data.data || response.data);
      } catch (err) {
        setErrorMsg("Gagal memuat katalog latihan.");
      } finally {
        setLoadingCatalog(false);
      }
    };
    fetchCatalog();
  }, []);

  // Tambah Latihan Baru ke Sesi Aktif
  const handleAddExerciseToSession = () => {
    if (!activeExerciseId) return;

    const chosen = exerciseCatalog.find(
      (e) => Number(e.id) === Number(activeExerciseId),
    );
    if (!chosen) return;

    if (
      selectedExercises.some((e) => Number(e.exercise_id) === Number(chosen.id))
    ) {
      setErrorMsg(`Latihan ${chosen.name} sudah ada di dalam daftar.`);
      return;
    }

    setErrorMsg("");
    setSelectedExercises([
      ...selectedExercises,
      {
        exercise_id: chosen.id,
        name: chosen.name,
        category: chosen.category,
        tracking_type: chosen.tracking_type || "weight_reps",
        sets: [
          { set_number: 1, weight_kg: "", reps: "", duration_minutes: "" },
        ],
      },
    ]);
    setActiveExerciseId("");
  };

  // Hapus Latihan dari Sesi
  const handleRemoveExercise = (exerciseId) => {
    setSelectedExercises(
      selectedExercises.filter(
        (e) => Number(e.exercise_id) !== Number(exerciseId),
      ),
    );
  };

  // Tambah Set Baru pada Latihan
  const handleAddSet = (exerciseId) => {
    setSelectedExercises(
      selectedExercises.map((item) => {
        if (Number(item.exercise_id) === Number(exerciseId)) {
          const nextSetNumber = item.sets.length + 1;
          const lastSet = item.sets[item.sets.length - 1] || {};
          return {
            ...item,
            sets: [
              ...item.sets,
              {
                set_number: nextSetNumber,
                weight_kg: lastSet.weight_kg || "",
                reps: lastSet.reps || "",
                duration_minutes: lastSet.duration_minutes || "",
              },
            ],
          };
        }
        return item;
      }),
    );
  };

  // Hapus Set (Membandingkan Number secara konsisten)
  const handleRemoveSet = (exerciseId, setIndex) => {
    setSelectedExercises(
      selectedExercises.map((item) => {
        if (Number(item.exercise_id) === Number(exerciseId)) {
          const updatedSets = item.sets
            .filter((_, idx) => idx !== setIndex)
            .map((set, idx) => ({ ...set, set_number: idx + 1 }));
          return { ...item, sets: updatedSets };
        }
        return item;
      }),
    );
  };

  // Handler Perubahan Input Nilai (Reps / Weight / Duration)
  const handleSetInputChange = (exerciseId, setIndex, field, value) => {
    setSelectedExercises(
      selectedExercises.map((item) => {
        if (Number(item.exercise_id) === Number(exerciseId)) {
          const updatedSets = [...item.sets];
          updatedSets[setIndex] = {
            ...updatedSets[setIndex],
            [field]: value,
          };
          return { ...item, sets: updatedSets };
        }
        return item;
      }),
    );
  };

  // Submit Payload Sesi Latihan ke API (Flat Array & Formatting Datetime MySQL)
  const handleSubmitSession = async (e) => {
    e.preventDefault();
    if (selectedExercises.length === 0) {
      setErrorMsg("Pilih minimal satu latihan untuk disimpan.");
      return;
    }

    const flatSets = [];
    for (const ex of selectedExercises) {
      for (const set of ex.sets) {
        if (ex.tracking_type === "duration") {
          if (!set.duration_minutes) {
            setErrorMsg(`Isi durasi (menit) pada ${ex.name}`);
            return;
          }
          flatSets.push({
            exercise_id: Number(ex.exercise_id),
            set_number: Number(set.set_number),
            reps: null,
            weight_kg: null,
            duration_seconds: Number(set.duration_minutes) * 60,
          });
        } else if (ex.tracking_type === "bodyweight_reps") {
          if (!set.reps) {
            setErrorMsg(`Isi jumlah repetisi pada ${ex.name}`);
            return;
          }
          flatSets.push({
            exercise_id: Number(ex.exercise_id),
            set_number: Number(set.set_number),
            reps: Number(set.reps),
            weight_kg: null,
            duration_seconds: null,
          });
        } else {
          // default: weight_reps
          if (!set.reps || !set.weight_kg) {
            setErrorMsg(`Isi beban (kg) dan repetisi pada ${ex.name}`);
            return;
          }
          flatSets.push({
            exercise_id: Number(ex.exercise_id),
            set_number: Number(set.set_number),
            reps: Number(set.reps),
            weight_kg: Number(set.weight_kg),
            duration_seconds: null,
          });
        }
      }
    }

    setSubmitting(true);
    setErrorMsg("");

    // Format Datetime MySQL: "YYYY-MM-DD HH:mm:ss"
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const payload = {
      date: formattedDate,
      day_type: null,
      notes: sessionNotes || null,
      sets: flatSets,
    };

    try {
      await sessionService.createSession(payload);
      navigate("/");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Gagal menyimpan sesi latihan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state: {
      exerciseCatalog,
      sessionNotes,
      selectedExercises,
      loadingCatalog,
      submitting,
      errorMsg,
      activeExerciseId,
    },
    actions: {
      setSessionNotes,
      setActiveExerciseId,
      handleAddExerciseToSession,
      handleRemoveExercise,
      handleAddSet,
      handleRemoveSet,
      handleSetInputChange,
      handleSubmitSession,
    },
  };
};
