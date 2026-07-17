import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { model, input, voice, response_format } = req.body

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input text is required' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://manager-app.vercel.app',
        'X-Title': 'Manager.app',
      },
      body: JSON.stringify({
        model: model || 'hexgrad/kokoro-82m',
        input,
        voice: voice || 'ff_heart',
        response_format: response_format || 'mp3',
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('TTS API error:', response.status, errText)
      return res.status(response.status).json({ error: 'TTS generation failed' })
    }

    const audioBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.status(200).send(Buffer.from(audioBuffer))
  } catch (err) {
    console.error('TTS error:', err)
    return res.status(500).json({ error: 'Failed to reach TTS API' })
  }
}
