// api/chat.js
// Vercelのサーバーレス関数 - APIキーはここで管理、外には出ない

export default async function handler(req, res) {
  // CORSヘッダー（同じVercelドメインからのみ許可）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTだけ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // APIキーはVercelの環境変数から取得（フロントエンドには絶対に出ない）
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'サーバー設定エラーです。管理者にお問い合わせください。' });
  }

  const { messages, systemPrompt } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'メッセージの形式が正しくありません。' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt || 'あなたは親切なアシスタントです。' },
          ...messages,
        ],
        max_tokens: 1024,
        temperature: 0.9,
      }),
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      console.error('Groq API error:', data);
      return res.status(groqRes.status).json({ error: data.error?.message || 'AIとの通信に失敗しました。' });
    }

    const reply = data.choices?.[0]?.message?.content || '（返答がありませんでした）';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'サーバーエラーが発生しました。しばらくしてから再試行してください。' });
  }
}