const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function buildSystemPrompt(team) {
  const teamList = team.length
    ? team.map((p) => `- ${p.name} (${p.types.join(', ')})`).join('\n')
    : 'Tim masih kosong';

  return `Kamu adalah asisten ahli Pokemon yang membantu pemain membangun tim yang kuat dan seimbang.

Tim saat ini:
${teamList}

Berikan saran dalam bahasa Indonesia yang ringkas dan jelas. Fokus pada: komposisi tipe, kelemahan tim, saran Pokemon tambahan, moveset, dan item yang cocok.`;
}

export async function chatWithGroq({ apiKey, messages, team }) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt(team) },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? 'Gagal menghubungi Groq API');
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
