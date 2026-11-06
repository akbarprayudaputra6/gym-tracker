import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const res = await register(name, email, password, passwordConfirm);
    if (res.success) {
      navigate("/");
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-success/10 p-3 rounded-full mb-2">
            <UserPlus className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold">Daftar Akun</h1>
          <p className="text-xs text-base-content/60">
            Buat akun untuk mulai mencatat sesi gym
          </p>
        </div>

        {errorMsg && (
          <div className="alert alert-error text-sm p-3 mb-4">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text">Nama Lengkap</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Min. 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text">Konfirmasi Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Ulangi password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-success w-full mt-2 ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-xs text-base-content/70 mt-4">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-success font-semibold hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
