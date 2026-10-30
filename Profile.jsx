
import { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
    // Identify the logged-in user
    const userEmail = localStorage.getItem("orgpilotUser") || "guest";
    const profileStorageKey = `orgpilotProfile_${userEmail}`;

    // Load saved profile information
    const [profile, setProfile] = useState(() => {
        try {
            const savedProfile = localStorage.getItem(profileStorageKey);

            return savedProfile
                ? JSON.parse(savedProfile)
                : {
                    name: "Lakshmi Manasa",
                    email: userEmail === "guest" ? "" : userEmail,
                    role: "Student",
                    phone: "",
                    college: "",
                    bio: "Welcome to OrgPilot AI! Manage your workspace and profile in one place."
                };
        } catch {
            return {
                name: "Lakshmi Manasa",
                email: userEmail === "guest" ? "" : userEmail,
                role: "Student",
                phone: "",
                college: "",
                bio: "Welcome to OrgPilot AI! Manage your workspace and profile in one place."
            };
        }
    });

    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState("");

    // Automatically save profile whenever it changes
    useEffect(() => {
        localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    }, [profile, profileStorageKey]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile(previous => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        localStorage.setItem(
            profileStorageKey,
            JSON.stringify(profile)
        );

        setEditing(false);
        setMessage("Profile updated successfully!");

        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

    const handleCancel = () => {
        const savedProfile = localStorage.getItem(profileStorageKey);

        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }

        setEditing(false);
        setMessage("");
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div>
                    <span className="profile-eyebrow">ACCOUNT SETTINGS</span>
                    <h1>My Profile</h1>
                    <p>Manage your personal information and account details.</p>
                </div>

                <button
                    className="profile-edit-btn"
                    onClick={() => {
                        if (editing) {
                            handleCancel();
                        } else {
                            setEditing(true);
                            setMessage("");
                        }
                    }}
                >
                    {editing ? "Cancel Editing" : "✎ Edit Profile"}
                </button>
            </div>

            {message && (
                <div className="profile-success">
                    {message}
                </div>
            )}

            <div className="profile-layout">
                <section className="profile-card profile-overview">
                    <div className="profile-cover">
                        <div className="profile-avatar">
                            {profile.name.trim().charAt(0).toUpperCase() || "U"}
                        </div>
                    </div>

                    <h2>{profile.name || "Your Name"}</h2>

                    <p className="profile-role">{profile.role}</p>

                    <p className="profile-email">
                        {profile.email || "Add your email address"}
                    </p>

                    <div className="profile-divider" />

                    <div className="profile-info-row">
                        <span>📞</span>
                        <div>
                            <small>Phone number</small>
                            <p>{profile.phone || "Not added"}</p>
                        </div>
                    </div>

                    <div className="profile-info-row">
                        <span>🎓</span>
                        <div>
                            <small>College / Organization</small>
                            <p>{profile.college || "Not added"}</p>
                        </div>
                    </div>

                    <div className="profile-status">
                        <span className="status-dot" />
                        Account active
                    </div>
                </section>

                <section className="profile-card profile-details">
                    <div className="profile-section-heading">
                        <div>
                            <h2>Personal Information</h2>
                            <p>Keep your account details up to date.</p>
                        </div>

                        <span className="profile-section-icon">♙</span>
                    </div>

                    <form onSubmit={handleSave}>
                        <div className="profile-form-grid">
                            <div className="profile-field">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={profile.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                />
                            </div>

                            <div className="profile-field">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={profile.role}
                                    onChange={handleChange}
                                    disabled={!editing}
                                >
                                    <option>Student</option>
                                    <option>Developer</option>
                                    <option>Administrator</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="profile-field">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    disabled={!editing}
                                />
                            </div>

                            <div className="profile-field full-width">
                                <label htmlFor="college">
                                    College / Organization
                                </label>
                                <input
                                    id="college"
                                    name="college"
                                    placeholder="Enter your college or organization"
                                    value={profile.college}
                                    onChange={handleChange}
                                    disabled={!editing}
                                />
                            </div>

                            <div className="profile-field full-width">
                                <label htmlFor="bio">About Me</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows="4"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    disabled={!editing}
                                />
                            </div>
                        </div>

                        {editing && (
                            <div className="profile-form-actions">
                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-save-btn"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </section>
            </div>

            <section className="profile-card profile-activity">
                <div>
                    <span className="activity-icon">✦</span>
                    <h3>Workspace</h3>
                    <p>Your OrgPilot AI workspace is ready to use.</p>
                </div>

                <span className="workspace-badge">
                    Personal Workspace
                </span>
            </section>
        </div>
    );
}

export default Profile;
