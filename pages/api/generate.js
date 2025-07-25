import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { topic } = req.body;

  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Неверный формат темы.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Сгенерируй оригинальную бизнес-идею на тему: "${topic}"`,
        },
      ],
    });

    const result = completion.choices[0].message.content;
    return res.status(200).json({ result });
  } catch (err) {
    console.error('GPT API error:', err);
    return res.status(500).json({ error: 'Ошибка генерации.' });
  }
}