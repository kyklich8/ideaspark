import React, { useState } from "react";

export default function App() {
  const [topic, setTopic] = useState("");
  const [idea, setIdea] = useState("");

  const generateIdea = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    setIdea(data.result || "Ошибка генерации.");
  };

  return (
    <div className="container">
      <h1>💡 IdeaSpark</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Введите тему"
      />
      <button onClick={generateIdea}>Сгенерировать</button>
      {idea && <div className="result">{idea}</div>}
    </div>
  );
}