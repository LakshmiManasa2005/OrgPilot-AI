
import { useState, useEffect, useRef } from "react";
import "../styles/upload.css";

function Upload() {
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState("");
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        loadFiles();
    }, []);

    function handleFileChange(event) {
        addFiles(Array.from(event.target.files || []));
        event.target.value = "";
    }

    function addFiles(newFiles) {
        setFiles(previous => {
            const combined = [...previous, ...newFiles];
            return combined.filter(
                (file, index) =>
                    combined.findIndex(
                        item => item.name === file.name && item.size === file.size
                    ) === index
            );
        });
        setStatus("");
    }

    function removeFile(index) {
        setFiles(previous => previous.filter((_, i) => i !== index));
    }

    async function loadFiles() {
        try {
            const response = await fetch("http://localhost:8080/files");
            if (!response.ok) throw new Error("Could not load files");
            const data = await response.json();
            setUploadedFiles(data);
        } catch (error) {
            console.error("File loading error:", error);
        }
    }

    async function handleUpload() {
        if (!files.length || uploading) return;

        setUploading(true);
        setStatus("");

        let successful = 0;
        const failed = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("http://localhost:8080/upload", {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(await response.text());
                }

                successful++;
            } catch (error) {
                failed.push(file.name);
            }
        }

        setFiles([]);
        await loadFiles();

        if (failed.length === 0) {
            setStatus(`Successfully uploaded ${successful} file(s).`);
        } else {
            setStatus(
                `${successful} uploaded. Failed: ${failed.join(", ")}`
            );
        }

        setUploading(false);
    }

    function formatSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function fileIcon(name) {
        const extension = name.split(".").pop().toLowerCase();
        if (extension === "pdf") return "📕";
        if (["doc", "docx"].includes(extension)) return "📘";
        if (["jpg", "jpeg", "png"].includes(extension)) return "🖼️";
        if (["xls", "xlsx", "csv"].includes(extension)) return "📗";
        return "📄";
    }

    return (
        <div className="upload-page">
            <div className="upload-heading">
                <div>
                    <span className="upload-eyebrow">DOCUMENT MANAGEMENT</span>
                    <h1>My Documents</h1>
                    <p>Upload, organize and access all your important files.</p>
                </div>
                <div className="upload-heading-icon">📁</div>
            </div>

            <div className="upload-overview">
                <div className="upload-overview-card">
                    <span className="overview-icon blue">📂</span>
                    <div>
                        <strong>{uploadedFiles.length}</strong>
                        <span>Stored documents</span>
                    </div>
                </div>
                <div className="upload-overview-card">
                    <span className="overview-icon purple">📤</span>
                    <div>
                        <strong>{files.length}</strong>
                        <span>Ready to upload</span>
                    </div>
                </div>
            </div>

            <section className="upload-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Upload new files</h2>
                        <p>Select documents from your device.</p>
                    </div>
                    <span className="panel-step">STEP 01</span>
                </div>

                <div
                    className={`drop-zone ${dragging ? "dragging" : ""}`}
                    onDragOver={event => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={event => {
                        event.preventDefault();
                        setDragging(false);
                        addFiles(Array.from(event.dataTransfer.files));
                    }}
                    onClick={() => inputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={event => {
                        if (event.key === "Enter" || event.key === " ") {
                            inputRef.current?.click();
                        }
                    }}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileChange}
                    />
                    <div className="drop-icon">☁️</div>
                    <h3>Drag and drop your files here</h3>
                    <p>or click below to browse your computer</p>
                    <button
                        type="button"
                        className="browse-btn"
                        onClick={event => {
                            event.stopPropagation();
                            inputRef.current?.click();
                        }}
                    >
                        Browse files
                    </button>
                    <span className="file-hint">
                        Select one or more files
                    </span>
                </div>

                {files.length > 0 && (
                    <div className="selected-files">
                        <div className="selected-heading">
                            <h3>Selected files ({files.length})</h3>
                            <button onClick={() => setFiles([])}>Remove all</button>
                        </div>

                        {files.map((file, index) => (
                            <div className="selected-file" key={`${file.name}-${index}`}>
                                <span className="file-type-icon">
                                    {fileIcon(file.name)}
                                </span>
                                <div className="selected-file-info">
                                    <strong>{file.name}</strong>
                                    <span>{formatSize(file.size)}</span>
                                </div>
                                <button
                                    className="remove-file-btn"
                                    onClick={() => removeFile(index)}
                                    disabled={uploading}
                                    aria-label={`Remove ${file.name}`}
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        <button
                            className="upload-action-btn"
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : `Upload ${files.length} file(s)`}
                            {!uploading && <span>↑</span>}
                        </button>
                    </div>
                )}

                {status && (
                    <div className="upload-status" role="status">
                        {status}
                    </div>
                )}
            </section>

            <section className="stored-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Your stored documents</h2>
                        <p>Files currently available in your workspace.</p>
                    </div>
                    <button className="refresh-btn" onClick={loadFiles}>
                        ↻ Refresh
                    </button>
                </div>

                {uploadedFiles.length === 0 ? (
                    <div className="empty-files">
                        <div>📭</div>
                        <h3>No documents yet</h3>
                        <p>Upload your first document to get started.</p>
                    </div>
                ) : (
                    <div className="stored-file-list">
                        {uploadedFiles.map((file, index) => (
                            <div className="stored-file" key={`${file}-${index}`}>
                                <span className="file-type-icon">
                                    {fileIcon(file)}
                                </span>
                                <div className="stored-file-info">
                                    <strong>{file}</strong>
                                    <span>Available in your workspace</span>
                                </div>
                                <a
                                    className="download-file-btn"
                                    href={`http://localhost:8080/download/${encodeURIComponent(file)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    ↓ Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Upload;
