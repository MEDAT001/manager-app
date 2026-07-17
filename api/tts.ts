import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text } = req.body

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not set')
    return res.status(500).json({ error: 'API key not configured' })
  }

  const truncated = text.length > 500 ? text.slice(0, 500) + '...' : text

  console.log('TTS request:', { textLength: truncated.length, model: 'hexgrad/kokoro-82m' })

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
        model: 'hexgrad/kokoro-82m',
        input: truncated,
        voice: 'ff_siwis',
        response_format: 'mp3',
      }),
    })

    console.log('OpenRouter TTS response:', response.status, response.headers.get('content-type'))

    if (!response.ok) {
      const errText = await response.text()
      console.error('OpenRouter TTS error:', response.status, errText)
      return res.status(response.status).json({ error: `TTS failed: ${response.status}`, detail: errText })
    }

    const audioBuffer = await response.arrayBuffer()
    console.log('Audio buffer size:', audioBuffer.byteLength)

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'no-cache')
    return res.status(200).send(Buffer.from(audioBuffer))
  } catch (err) {
    console.error('TTS exception:', err)
    return res.status(500).json({ error: 'Failed to reach TTS API', detail: String(err) })
  }
}
