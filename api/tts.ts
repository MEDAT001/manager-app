import type { VercelRequest, VercelResponse } from '@vercel/node'

const DEFAULT_VOICE_ID = 'CYR0HqHoZAUmoZsLWPob'
const DEFAULT_MODEL_ID = 'eleven_multilingual_v2'

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

  const { text, voice_id, model_id } = req.body

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY not set')
    return res.status(500).json({ error: 'API key not configured' })
  }

  const vid = voice_id || DEFAULT_VOICE_ID
  const mid = model_id || DEFAULT_MODEL_ID
  const truncated = text.length > 5000 ? text.slice(0, 5000) + '...' : text

  console.log('TTS request:', { textLength: truncated.length, voice: vid, model: mid })

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${vid}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: truncated,
          model_id: mid,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    )

    console.log('ElevenLabs response:', response.status, response.headers.get('content-type'))

    if (!response.ok) {
      const errText = await response.text()
      console.error('ElevenLabs error:', response.status, errText)
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
