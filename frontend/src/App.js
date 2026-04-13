import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadMsg(data.message || data.error);
    } catch {
      setUploadMsg("Upload failed. Is the server running?");
    }
    setUploading(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    const userMsg = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.answer || data.error }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Error connecting to server." }]);
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.logo}>⚡ RAG<span style={s.logoAccent}>Chat</span></div>
        <p style={s.tagline}>AI-powered document assistant</p>
        <div style={s.divider} />
        <div style={s.uploadSection}>
          <p style={s.sectionLabel}>📄 UPLOAD DOCUMENT</p>
          <label style={s.uploadBtn}>
            {uploading ? "Uploading..." : "Choose PDF"}
            <input type="file" accept=".pdf" onChange={handleUpload} style={{ display: "none" }} />
          </label>
          {uploadMsg && (
            <div style={s.uploadMsg}>
              ✅ {uploadMsg}
            </div>
          )}
        </div>
        <div style={s.divider} />
        <div style={s.infoBox}>
          <p style={s.infoTitle}>How it works</p>
          <p style={s.infoText}>1. Upload a PDF document</p>
          <p style={s.infoText}>2. Ask any question about it</p>
          <p style={s.infoText}>3. Get AI-powered answers</p>
        </div>
        <div style={s.badge}>Built with RAG + Gemini</div>
      </div>

      {/* Main Chat */}
      <div style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <span style={s.headerTitle}>Document Chat</span>
          <span style={s.headerStatus}>
            <span style={s.dot} /> Live
          </span>
        </div>

        {/* Messages */}
        <div style={s.chatArea}>
          {messages.length === 0 && (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>🤖</div>
              <p style={s.emptyTitle}>Ask me anything about your document</p>
              <p style={s.emptySubtitle}>Upload a PDF and start chatting</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={msg.role === "user" ? s.userRow : s.botRow}>
              <div style={msg.role === "user" ? s.userBubble : s.botBubble}>
                {msg.role === "bot" && <span style={s.botLabel}>AI</span>}
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={s.botRow}>
              <div style={s.botBubble}>
                <span style={s.botLabel}>AI</span>
                <span style={s.typing}>thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={s.inputArea}>
          <input
            style={s.input}
            type="text"
            placeholder="Ask a question about your document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <button style={s.sendBtn} onClick={handleAsk}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    fontFamily: "'Segoe UI', monospace",
    overflow: "hidden",
  },
  sidebar: {
    width: "280px",
    minWidth: "280px",
    backgroundColor: "#111",
    borderRight: "1px solid #222",
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: "-1px",
  },
  logoAccent: { color: "#00ff88" },
  tagline: { color: "#555", fontSize: "0.8rem", marginBottom: "8px" },
  divider: { height: "1px", backgroundColor: "#222", margin: "12px 0" },
  uploadSection: { display: "flex", flexDirection: "column", gap: "10px" },
  sectionLabel: { color: "#555", fontSize: "0.7rem", letterSpacing: "2px" },
  uploadBtn: {
    backgroundColor: "#00ff88",
    color: "#000",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
    textAlign: "center",
    display: "block",
  },
  uploadMsg: {
    backgroundColor: "#0a2a1a",
    border: "1px solid #00ff8844",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "0.8rem",
    color: "#00ff88",
  },
  infoBox: {
    backgroundColor: "#0f0f0f",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  infoTitle: { color: "#00ff88", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" },
  infoText: { color: "#555", fontSize: "0.78rem" },
  badge: {
    marginTop: "auto",
    backgroundColor: "#0f0f0f",
    border: "1px solid #222",
    borderRadius: "20px",
    padding: "8px 14px",
    fontSize: "0.75rem",
    color: "#555",
    textAlign: "center",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "20px 28px",
    borderBottom: "1px solid #222",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0f0f0f",
  },
  headerTitle: { fontWeight: "bold", fontSize: "1rem", color: "#fff" },
  headerStatus: { display: "flex", alignItems: "center", gap: "6px", color: "#00ff88", fontSize: "0.8rem" },
  dot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#00ff88",
    borderRadius: "50%",
    display: "inline-block",
  },
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  emptyState: {
    margin: "auto",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  emptyIcon: { fontSize: "3rem" },
  emptyTitle: { color: "#fff", fontSize: "1.1rem", fontWeight: "bold" },
  emptySubtitle: { color: "#555", fontSize: "0.9rem" },
  userRow: { display: "flex", justifyContent: "flex-end" },
  botRow: { display: "flex", justifyContent: "flex-start" },
  userBubble: {
    backgroundColor: "#00ff88",
    color: "#000",
    padding: "12px 16px",
    borderRadius: "18px 18px 4px 18px",
    maxWidth: "70%",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  botBubble: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "18px 18px 18px 4px",
    maxWidth: "70%",
    fontSize: "0.95rem",
    lineHeight: "1.6",
  },
  botLabel: {
    display: "inline-block",
    backgroundColor: "#00ff88",
    color: "#000",
    fontSize: "0.65rem",
    fontWeight: "bold",
    padding: "2px 6px",
    borderRadius: "4px",
    marginRight: "8px",
  },
  typing: { color: "#555", fontStyle: "italic" },
  inputArea: {
    padding: "20px 28px",
    borderTop: "1px solid #222",
    display: "flex",
    gap: "12px",
    backgroundColor: "#0f0f0f",
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
  },
  sendBtn: {
    backgroundColor: "#00ff88",
    color: "#000",
    border: "none",
    borderRadius: "12px",
    padding: "14px 20px",
    fontSize: "1.2rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default App;