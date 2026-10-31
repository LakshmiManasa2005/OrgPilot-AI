
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.text();
      alert(result);

      if (result === "Registration Successful") {
        navigate("/");
      }
    } catch (error) {
      alert("Cannot connect to backend.");
    }
  }

  return (
    <div className="register-page">
      <section className="register-visual">
        <div className="register-visual-content">
          <div className="register-brand">
            <span className="register-brand-icon">O</span>
            OrgPilot <strong>AI</strong>
          </div>

          <div className="register-message">
            <span>START YOUR JOURNEY</span>
            <h1>Make room for<br />smarter work.</h1>
            <p>
              Create your account and experience a better
              way to manage documents and knowledge with AI.
            </p>

            <div className="register-feature">
              <span>✦</span> One workspace for your knowledge
            </div>
            <div className="register-feature">
              <span>✦</span> AI-powered document assistance
            </div>
            <div className="register-feature">
              <span>✦</span> Simple and organized workflows
            </div>
          </div>
        </div>
        <div className="register-decoration" />
      </section>

      <section className="register-form-section">
        <div className="register-form-card">
          <div className="register-mobile-brand">✦ OrgPilot AI</div>

          <span className="register-eyebrow">CREATE YOUR ACCOUNT</span>
          <h2>Get started today</h2>
          <p className="register-description">
            Fill in your details to create your workspace.
          </p>

          <div className="register-group">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="register-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="register-group">
            <label>Password</label>
            <div className="register-password">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button className="register-submit" onClick={handleRegister}>
            Create Account <span>→</span>
          </button>

          <p className="register-switch">
            Already have an account?
            <span onClick={() => navigate("/")}> Sign in</span>
          </p>

          <div className="register-footer">
            © 2026 OrgPilot AI. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
