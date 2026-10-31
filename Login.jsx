
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.text();

      if (result === "Login Successful") {

       localStorage.setItem("orgpilotUser", email);
       navigate("/dashboard");
      } else {
        alert(result);
      }
    } catch (error) {
      alert("Cannot connect to backend.");
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="visual-content">
          <div className="brand-logo">
            <span className="brand-symbol">O</span>
            <span>OrgPilot <strong>AI</strong></span>
          </div>

          <div className="visual-message">
            <span className="eyebrow">YOUR INTELLIGENT WORKSPACE</span>
            <h1>Knowledge that<br />moves your business<br /><span>forward.</span></h1>
            <p>
              Bring your documents, ideas and AI-powered
              assistance together in one intelligent workspace.
            </p>
          </div>

          <div className="visual-bottom">
            <div className="visual-line" />
            <span>Organize smarter. Work faster.</span>
          </div>
        </div>

        <div className="visual-orb orb-one" />
        <div className="visual-orb orb-two" />
      </section>

      <section className="auth-form-section">
        <div className="auth-form-card">
          <div className="mobile-brand">✦ OrgPilot AI</div>

          <span className="form-eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="form-description">
            Enter your details to access your workspace.
          </p>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button className="auth-submit" onClick={handleLogin}>
            Sign In <span>→</span>
          </button>

          <p className="auth-switch">
            Don't have an account?
            <span onClick={() => navigate("/register")}> Create account</span>
          </p>

          <div className="auth-footer">
            © 2026 OrgPilot AI. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
