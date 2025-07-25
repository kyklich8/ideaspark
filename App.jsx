import { useState } from 'react';

export default function App() {
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setResponse(data.result);
    } catch (err) {
      setResponse('Ошибка при генерации.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">💡 IdeaSpark</h1>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Введите тему для идеи"
        className="w-full max-w-md p-2 rounded border"
      />
      <button
        onClick={handleGenerate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={loading || !topic.trim()}
      >
        {loading ? 'Генерация...' : 'Сгенерировать идею'}
      </button>

      {response && (
        <div className="mt-6 max-w-xl bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Результат:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}