import { useEffect, useState } from "react";
import "./dashboard.css";

function Dashboard() {
    const [documents, setDocuments] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        try {
            setLoading(true);

            const response = await fetch("http://localhost:8080/documents");

            if (!response.ok) {
                throw new Error("Unable to load documents");
            }

            const data = await response.json();
            setDocuments(data);
        } catch (error) {
            alert("Unable to connect to backend.");
        } finally {
            setLoading(false);
        }
    }

    async function searchDocuments() {
        if (keyword.trim() === "") {
            loadDocuments();
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `http://localhost:8080/search?keyword=${encodeURIComponent(keyword)}`
            );

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();
            setDocuments(data);
        } catch (error) {
            alert("Unable to search documents.");
        } finally {
            setLoading(false);
        }
    }

    async function deleteDocument(id) {
        if (!window.confirm("Are you sure you want to delete this document?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/documents/${id}`,
                { method: "DELETE" }
            );

            const result = await response.text();

            if (!response.ok) {
                throw new Error(result);
            }

            alert(result);
            loadDocuments();
        } catch (error) {
            alert("Unable to delete document.");
        }
    }

    return (
        <main className="main-content">

            <header className="dashboard-header">
                <div>
                    <p className="welcome-text">WELCOME TO ORGPILOT AI</p>
                    <h1>Dashboard</h1>
                    <p className="header-subtitle">
                        Manage and organize your documents in one place.
                    </p>
                </div>
            </header>

            <section className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-icon">📁</div>
                    <div>
                        <p>Total Documents</p>
                        <h2>{documents.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🤖</div>
                    <div>
                        <p>AI Assistant</p>
                        <h2>OrgPilot AI</h2>
                    </div>
                </div>

            </section>

            <section className="documents-section">

                <div className="section-header">
                    <div>
                        <h2>Uploaded Documents</h2>
                        <p>View and manage your uploaded files.</p>
                    </div>

                    <span className="document-count">
                        {documents.length} Files
                    </span>
                </div>

                <div className="search-container">

                    <input
                        type="text"
                        placeholder="Search by filename..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") searchDocuments();
                        }}
                    />

                    <button
                        className="search-btn"
                        onClick={searchDocuments}
                    >
                        🔍 Search
                    </button>

                    <button
                        className="show-all-btn"
                        onClick={() => {
                            setKeyword("");
                            loadDocuments();
                        }}
                    >
                        Show All
                    </button>

                </div>

                <div className="table-container">

                    <table className="documents-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>File Name</th>
                                <th>File Path</th>
                                <th>Download</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="empty-message">
                                        Loading documents...
                                    </td>
                                </tr>
                            ) : documents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-message">
                                        No documents found.
                                    </td>
                                </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc.id}>

                                        <td>{doc.id}</td>

                                        <td className="file-name">
                                            📄 {doc.fileName}
                                        </td>

                                        <td className="file-path">
                                            {doc.filePath}
                                        </td>

                                        <td>
                                            <a
                                                className="download-btn"
                                                href={`http://localhost:8080/download/${encodeURIComponent(doc.fileName)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Download
                                            </a>
                                        </td>

                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteDocument(doc.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </main>
    );
}

export default Dashboard;
