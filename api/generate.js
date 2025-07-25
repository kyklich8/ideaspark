export default async function handler(req, res) {
  const { topic } = req.body;
  res.status(200).json({ result: `Генерация идеи по теме "${topic}"...` });
}