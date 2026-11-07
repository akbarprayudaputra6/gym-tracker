import api from "../api/axios";

export const sessionService = {
  getExercisesCatalog: () => api.get("/exercises"),
  createSession: (payload) => api.post("/sessions", payload),
};
