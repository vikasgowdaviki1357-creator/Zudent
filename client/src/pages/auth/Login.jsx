import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Lock,
  Mail,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your college email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // LOGIN
      // Email + Password ONLY
      // ==================================================

      const user = await login(
        cleanEmail,
        password
      );

      if (!user) {
        throw new Error(
          "Login failed. User information was not returned."
        );
      }

      // ==================================================
      // ROLE FROM BACKEND
      // ==================================================

      const role = String(
        user.role || ""
      )
        .trim()
        .toLowerCase();

      console.log("LOGIN SUCCESS");
      console.log("User:", user);
      console.log("Role:", role);

      if (!role) {
        throw new Error(
          "User role is missing from the server response."
        );
      }

      // ==================================================
      // REDIRECT BASED ON DATABASE ROLE
      // ==================================================

      switch (role) {
        case "student":
          navigate("/student", {
            replace: true,
          });
          break;

        case "faculty":
          navigate("/faculty", {
            replace: true,
          });
          break;

        case "hod":
          navigate("/hod", {
            replace: true,
          });
          break;

        case "admin":
          navigate("/admin", {
            replace: true,
          });
          break;

        default:
          throw new Error(
            `Unsupported user role: ${role}`
          );
      }
    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to sign in. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =====================================================
          LEFT BRAND SECTION
      ===================================================== */}

      <section className="login-brand">
        <div className="brand-content">

          <div className="brand-icon">
            <GraduationCap size={34} />
          </div>

          <h1>JIT Super App</h1>

          <p>
            Academics, campus services, resources,
            placements and student life — connected
            in one platform.
          </p>

          <div className="brand-features">
            <span>Academics</span>
            <span>Resources</span>
            <span>Marketplace</span>
            <span>Placements</span>
            <span>Campus</span>
          </div>

        </div>
      </section>

      {/* =====================================================
          LOGIN SECTION
      ===================================================== */}

      <section className="login-section">
        <div className="login-card">

          {/* MOBILE LOGO */}

          <div className="mobile-logo">
            <GraduationCap size={30} />
            <strong>JIT Super App</strong>
          </div>

          <p className="eyebrow">
            WELCOME BACK
          </p>

          <h2>
            Sign in to your account
          </h2>

          <p className="login-description">
            Enter your college credentials to continue.
          </p>

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div
              style={{
                color: "#B91C1C",
                marginBottom: "1.25rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#FEE2E2",
                borderRadius: "10px",
                fontSize: "0.875rem",
                border: "1px solid #FCA5A5",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* =================================================
                EMAIL
            ================================================= */}

            <label htmlFor="email">
              College Email
            </label>

            <div className="input-wrapper">

              <Mail size={19} />

              <input
                id="email"
                type="email"
                placeholder="Enter your college email"
                autoComplete="username"
                value={email}
                required
                onChange={(event) => {
                  setEmail(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
              />

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <label htmlFor="password">
              Password
            </label>

            <div className="input-wrapper">

              <Lock size={19} />

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                required
                onChange={(event) => {
                  setPassword(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
              />

            </div>

            {/* =================================================
                REMEMBER / FORGOT
            ================================================= */}

            <div className="form-row">

              <label className="remember">
                <input
                  type="checkbox"
                  defaultChecked
                />

                Remember me
              </label>

              <button
                type="button"
                className="text-button"
              >
                Forgot password?
              </button>

            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

          <p className="login-note">
            Jyothy Institute of Technology
          </p>

        </div>
      </section>

    </div>
  );
}

export default Login;