import { useNewSession } from "../hooks/useNewSession";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Dumbbell,
  Calendar,
  AlertCircle,
} from "lucide-react";

const NewSession = () => {
  const { state, actions } = useNewSession();
  const {
    exerciseCatalog,
    sessionNotes,
    selectedExercises,
    loadingCatalog,
    submitting,
    errorMsg,
    activeExerciseId,
  } = state;

  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Pencatatan Sesi Gym</h1>
          <p className="text-xs text-base-content/60 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-error text-xs p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="form-control">
        <input
          type="text"
          placeholder="Catatan sesi hari ini (mis: Leg Day Focus Squat)..."
          className="input input-bordered input-sm w-full text-xs"
          value={sessionNotes}
          onChange={(e) => actions.setSessionNotes(e.target.value)}
        />
      </div>

      <div className="card bg-base-100 p-3 border border-base-200 shadow-sm space-y-2">
        <label className="label-text font-semibold text-xs">
          Pilih Latihan untuk Ditambahkan:
        </label>
        <div className="flex gap-2">
          <select
            className="select select-bordered select-sm flex-1 text-xs"
            value={activeExerciseId}
            onChange={(e) => actions.setActiveExerciseId(e.target.value)}
            disabled={loadingCatalog}
          >
            <option value="">-- Pilih dari Katalog --</option>
            {exerciseCatalog.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.category})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={actions.handleAddExerciseToSession}
            className="btn btn-primary btn-sm gap-1"
            disabled={!activeExerciseId}
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Tambah</span>
          </button>
        </div>
      </div>

      <form onSubmit={actions.handleSubmitSession} className="space-y-4">
        {selectedExercises.length === 0 ? (
          <div className="text-center py-10 bg-base-100 rounded-2xl border border-dashed border-base-300 p-6">
            <Dumbbell className="w-10 h-10 text-base-content/30 mx-auto mb-2" />
            <p className="text-xs text-base-content/60">
              Belum ada latihan yang dipilih. Gunakan pemilih di atas untuk
              mulai mencatat.
            </p>
          </div>
        ) : (
          selectedExercises.map((exerciseItem) => (
            <div
              key={exerciseItem.exercise_id}
              className="card bg-base-100 p-4 border border-base-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-base-200 pb-2">
                <div>
                  <h3 className="font-bold text-sm text-primary">
                    {exerciseItem.name}
                  </h3>
                  <span className="badge badge-ghost badge-xs uppercase text-[9px]">
                    {exerciseItem.category}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    actions.handleRemoveExercise(exerciseItem.exercise_id)
                  }
                  className="btn btn-ghost btn-xs text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 text-[10px] font-bold text-base-content/60 px-1 text-center">
                  <span className="col-span-2">SET</span>
                  {exerciseItem.tracking_type === "duration" ? (
                    <span className="col-span-8">DURASI (MENIT)</span>
                  ) : exerciseItem.tracking_type === "bodyweight_reps" ? (
                    <span className="col-span-8">REPETISI</span>
                  ) : (
                    <>
                      <span className="col-span-4">BEBAN (KG)</span>
                      <span className="col-span-4">REPETISI</span>
                    </>
                  )}
                  <span className="col-span-2"></span>
                </div>

                {exerciseItem.sets.map((set, setIndex) => (
                  <div
                    key={`${exerciseItem.exercise_id}-set-${setIndex}`}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <span className="col-span-2 text-center text-xs font-bold bg-base-200 py-1.5 rounded-lg">
                      #{set.set_number}
                    </span>

                    {exerciseItem.tracking_type === "duration" ? (
                      <input
                        type="number"
                        placeholder="Durasi (Menit)"
                        className="col-span-8 input input-bordered input-sm text-center text-xs px-1"
                        value={set.duration_minutes || ""}
                        onChange={(e) =>
                          actions.handleSetInputChange(
                            exerciseItem.exercise_id,
                            setIndex,
                            "duration_minutes",
                            e.target.value,
                          )
                        }
                        required
                      />
                    ) : exerciseItem.tracking_type === "bodyweight_reps" ? (
                      <input
                        type="number"
                        placeholder="Jumlah Repetisi"
                        className="col-span-8 input input-bordered input-sm text-center text-xs px-1"
                        value={set.reps || ""}
                        onChange={(e) =>
                          actions.handleSetInputChange(
                            exerciseItem.exercise_id,
                            setIndex,
                            "reps",
                            e.target.value,
                          )
                        }
                        required
                      />
                    ) : (
                      <>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="0"
                          className="col-span-4 input input-bordered input-sm text-center text-xs px-1"
                          value={set.weight_kg || ""}
                          onChange={(e) =>
                            actions.handleSetInputChange(
                              exerciseItem.exercise_id,
                              setIndex,
                              "weight_kg",
                              e.target.value,
                            )
                          }
                          required
                        />
                        <input
                          type="number"
                          placeholder="0"
                          className="col-span-4 input input-bordered input-sm text-center text-xs px-1"
                          value={set.reps || ""}
                          onChange={(e) =>
                            actions.handleSetInputChange(
                              exerciseItem.exercise_id,
                              setIndex,
                              "reps",
                              e.target.value,
                            )
                          }
                          required
                        />
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        actions.handleRemoveSet(
                          exerciseItem.exercise_id,
                          setIndex,
                        )
                      }
                      className="col-span-2 btn btn-ghost btn-xs text-error/70 hover:text-error"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => actions.handleAddSet(exerciseItem.exercise_id)}
                className="btn btn-sm btn-block btn-ghost border-dashed border-base-300 text-xs gap-1 mt-2"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Set
              </button>
            </div>
          ))
        )}

        {selectedExercises.length > 0 && (
          <button
            type="submit"
            className={`btn btn-success btn-lg w-full shadow-lg shadow-success/20 gap-2 ${
              submitting ? "loading" : ""
            }`}
            disabled={submitting}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {submitting ? "Menyimpan Sesi..." : "Selesaikan & Simpan Sesi"}
            </span>
          </button>
        )}
      </form>
    </div>
  );
};

export default NewSession;
