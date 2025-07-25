import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import avatar from './assets/avatar.jpg';

const App = () => {
  const [topic, setTopic] = useState('');
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setIdea('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setIdea(data.result || 'Ошибка генерации.');
    } catch (err) {
      setIdea('Произошла ошибка. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (idea) {
      await navigator.clipboard.writeText(idea);
      alert('Идея скопирована в буфер обмена!');
    }
  };

  const shareToTelegram = () => {
    const message = encodeURIComponent(`Вот бизнес-идея от IdeaSpark:\n${idea}`);
    const url = `https://t.me/share/url?text=${message}`;
    window.open(url, '_blank');
  };

  const saveIdea = () => {
    if (idea && !history.includes(idea)) {
      setHistory(prev => [idea, ...prev]);
    }
  };

  const clearHistory = () => setHistory([]);

  const exportIdeas = () => {
    const blob = new Blob([history.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ideas.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-2xl font-bold text-indigo-600">IdeaSpark</h1>
        <img src={avatar} alt="Аватар" className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-md" />
      </header>

      <main className="p-6 text-center text-gray-800 dark:text-white max-w-xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-2xl font-semibold mb-4">Генератор бизнес-идей</motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-base opacity-80 mb-6">Введите тему ниже, чтобы получить оригинальную идею от AI.</motion.p>

        <motion.input initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}
          type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
          placeholder="Например: Здоровье, Образование, Спорт..." className="w-full px-4 py-2 border rounded-md mb-4 text-black" />

        <motion.button onClick={handleGenerate} disabled={loading} whileTap={{ scale: 0.97 }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md">
          {loading ? 'Генерация...' : 'Сгенерировать идею'}
        </motion.button>

        <AnimatePresence>
          {idea && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }} className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">💡 Идея:</h3>
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line mb-4">{idea}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={copyToClipboard} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">
                  📋 Скопировать
                </button>
                <button onClick={shareToTelegram} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
                  📤 Поделиться в Telegram
                </button>
                <button onClick={saveIdea} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded">
                  💾 Сохранить
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div className="mt-10 text-left">
            <h4 className="text-xl font-bold mb-2">🗂 История идей:</h4>
            <ul className="space-y-2">
              {history.map((item, i) => (
                <li key={i} className="p-3 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-3">
              <button onClick={clearHistory} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">
                🗑 Очистить всё
              </button>
              <button onClick={exportIdeas} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded">
                📄 Экспорт
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
